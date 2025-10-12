/**
 * 解答処理サービス
 * Step 2.2: 解答記録機能実装
 * CBT形式解答の送信・判定・記録を統合管理
 */

import { CBTAnswerData, SessionType } from "../types/database";
import { Question, QuestionCorrectAnswer } from "../types/models";
import { logger } from "../utils/logger";
import {
  QuestionTemplate,
  QuestionField,
  AnswerData,
  LedgerEntry,
  TrialBalanceEntry,
  FinancialStatementEntry,
  CorrectAnswer,
  safeJsonParse,
} from "../types/enhanced-types";
import {
  LearningHistoryRepository,
  CBTAnswerRecord,
} from "../data/repositories/learning-history-repository";
import { QuestionRepository } from "../data/repositories/question-repository";
import { ReviewService, ReviewUpdateResult } from "./review-service";
import { statisticsCache } from "./statistics-cache";
import { v4 as uuidv4 } from "../utils/uuid";

/**
 * 解答送信リクエスト
 */
export interface SubmitAnswerRequest {
  questionId: string;
  answerData: CBTAnswerData;
  sessionType: SessionType;
  sessionId?: string;
  startTime: number; // タイムスタンプ（ミリ秒）
}

/**
 * 解答送信レスポンス
 */
export interface SubmitAnswerResponse {
  success: boolean;
  isCorrect: boolean;
  answerTimeMs: number;
  explanation: string;
  correctAnswer: QuestionCorrectAnswer;
  validationErrors?: string[];
  sessionId: string;
  historyId: number;
  reviewUpdate?: ReviewUpdateResult; // 復習状況更新結果
}

/**
 * 解答処理サービスクラス
 */
export class AnswerService {
  private questionRepository: QuestionRepository;
  private learningHistoryRepository: LearningHistoryRepository;
  private reviewService: ReviewService;

  constructor(
    questionRepository?: QuestionRepository,
    learningHistoryRepository?: LearningHistoryRepository,
    reviewService?: ReviewService,
  ) {
    // 依存性注入対応 - テスト時にはモックを、通常実行時にはデフォルトインスタンスを使用
    this.questionRepository =
      questionRepository ||
      require("../data/repositories/question-repository").questionRepository;
    this.learningHistoryRepository =
      learningHistoryRepository ||
      require("../data/repositories/learning-history-repository")
        .learningHistoryRepository;
    this.reviewService =
      reviewService || require("./review-service").reviewService;
  }
  /**
   * 解答送信処理
   */
  public async submitAnswer(
    request: SubmitAnswerRequest,
  ): Promise<SubmitAnswerResponse> {
    const startProcessTime = Date.now();

    try {
      logger.debug("[AnswerService] 解答送信開始: ${request.questionId}");

      // 1. 問題データ取得
      const question = await this.questionRepository.findById(
        request.questionId,
      );
      if (!question) {
        throw new Error(`問題が見つかりません: ${request.questionId}`);
      }

      // 2. 解答時間計算
      const answerTimeMs = Date.now() - request.startTime;

      // 3. バリデーション実行
      const validationErrors = this.validateAnswer(
        request.answerData,
        question,
      );

      // バリデーション結果をチェック

      // 4. 正解判定
      const isCorrect =
        validationErrors.length === 0 &&
        this.isAnswerCorrect(request.answerData, question);

      // 正解判定完了

      // 5. セッションID生成（未提供の場合）
      const sessionId = request.sessionId || uuidv4();

      // 6. 学習履歴記録
      const answerRecord: CBTAnswerRecord = {
        questionId: request.questionId,
        answerData: request.answerData,
        isCorrect,
        answerTimeMs,
        sessionId,
        sessionType: request.sessionType,
        validationErrors:
          validationErrors.length > 0 ? validationErrors : undefined,
      };

      const historyRecord =
        await this.learningHistoryRepository.recordAnswer(answerRecord);

      // 7. 統計キャッシュ無効化
      statisticsCache.invalidateOnAnswerSubmit();

      // 8. 復習状況更新（全セッションタイプで実行）
      let reviewUpdate: ReviewUpdateResult | undefined;
      try {
        logger.debug(
          `[AnswerService] 復習状況更新開始: questionId=${request.questionId}, isCorrect=${isCorrect}, sessionType=${request.sessionType}`,
        );

        // 学習・復習セッションでは常に更新、それ以外では不正解時のみ更新
        const shouldUpdate =
          request.sessionType === "learning" ||
          request.sessionType === "review" ||
          !isCorrect; // 間違えた問題は全セッションで復習リストに追加

        if (shouldUpdate) {
          reviewUpdate = await this.reviewService.updateReviewStatus(
            request.questionId,
            isCorrect,
            answerTimeMs,
          );
          logger.debug(
            `[AnswerService] 復習状況更新完了: ${reviewUpdate.action} - ${reviewUpdate.message}`,
          );
          logger.debug(
            `[AnswerService] 復習状況更新詳細: previousStatus=${reviewUpdate.previousStatus}, newStatus=${reviewUpdate.newStatus}, previousPriority=${reviewUpdate.previousPriority}, newPriority=${reviewUpdate.newPriority}`,
          );
        } else {
          logger.debug(
            `[AnswerService] 復習状況更新スキップ: sessionType=${request.sessionType}, isCorrect=${isCorrect} (正解のため更新不要)`,
          );
        }
      } catch (reviewError) {
        logger.error(
          "[AnswerService] 復習状況更新エラー:",
          reviewError as Error,
        );
        logger.error("[AnswerService] Error details:", reviewError as Error, {
          message:
            reviewError instanceof Error
              ? reviewError.message
              : String(reviewError),
          stack: reviewError instanceof Error ? reviewError.stack : undefined,
        });
        // 復習状況更新エラーは致命的ではないため、処理を継続
      }

      // 9. 正解データ取得
      let correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

      // auxiliary_book問題の場合、正答データはanswer_template_jsonに埋め込まれている
      try {
        const answerTemplate = safeJsonParse<QuestionTemplate>(
          question.answer_template_json,
          {} as QuestionTemplate,
        );
        if (
          answerTemplate?.type === "auxiliary_book" &&
          answerTemplate.correctAnswers
        ) {
          correctAnswer = {
            correctAnswers: answerTemplate.correctAnswers,
          } as QuestionCorrectAnswer;
        }
      } catch (error) {
        logger.error(
          "[AnswerService] auxiliary_book正解データ取得エラー:",
          error as Error,
        );
      }

      const response: SubmitAnswerResponse = {
        success: true,
        isCorrect,
        answerTimeMs,
        explanation: question.explanation,
        correctAnswer,
        validationErrors:
          validationErrors.length > 0 ? validationErrors : undefined,
        sessionId,
        historyId: historyRecord.id,
        reviewUpdate,
      };

      const processTime = Date.now() - startProcessTime;
      logger.debug(
        `[AnswerService] 解答送信完了: ${request.questionId}, 正解=${isCorrect}, 処理時間=${processTime}ms`,
      );

      return response;
    } catch (error) {
      logger.error("[AnswerService] 解答送信エラー:", error as Error);
      throw error;
    }
  }

  /**
   * 解答バリデーション
   */
  private validateAnswer(
    answerData: CBTAnswerData,
    question: Question,
  ): string[] {
    const errors: string[] = [];

    try {
      const template = safeJsonParse<QuestionTemplate>(
        question.answer_template_json,
        {} as QuestionTemplate,
      );

      // 各問題タイプに応じた専用バリデーション
      if (template.type === "voucher_entry") {
        return this.validateVoucherAnswer(answerData, template);
      }

      // 用語穴埋め問題の場合は専用バリデーションを使用
      if (template.type === "vocabulary") {
        return this.validateVocabularyAnswer(answerData, template);
      }

      // 勘定記入空欄補充問題の場合は専用バリデーションを使用
      if (template.type === "fill_in_ledger") {
        return this.validateFillInLedgerAnswer(answerData, template);
      }

      // 補助簿記入問題の場合は専用バリデーションを使用
      if (template.type === "auxiliary_book") {
        return this.validateAuxiliaryBookAnswer(answerData, template);
      }

      // 試算表穴埋め問題の場合は専用バリデーションを使用
      if (template.type === "fill_in_trial_balance") {
        return this.validateFillInTrialBalanceAnswer(answerData, template);
      }

      // 合計残高試算表穴埋め問題の場合は専用バリデーションを使用
      if (template.type === "fill_in_comprehensive_trial_balance") {
        return this.validateFillInComprehensiveTrialBalanceAnswer(
          answerData,
          template,
        );
      }

      // 財務諸表穴埋め問題の場合は専用バリデーションを使用
      if (template.type === "fill_in_financial_statement") {
        return this.validateFillInFinancialStatementAnswer(
          answerData,
          template,
        );
      }

      // 複数空欄選択問題の場合は専用バリデーションを使用
      if (
        template.type === "multiple_choice" &&
        template.questions &&
        Array.isArray(template.questions)
      ) {
        return this.validateMultipleBlankChoiceAnswer(answerData, template);
      }

      // 他のタイプ(journal_entry, subsidiary_book, ledger_account,
      // financial_statement, worksheet, trial_balance)は共通バリデーション処理を使用

      // 必須フィールドチェック
      template.fields?.forEach((field: QuestionField) => {
        const value = (answerData as AnswerData)[field.name];
        if (
          field.required &&
          (value === null || value === undefined || value === "")
        ) {
          // フィールドタイプに応じた具体的なエラーメッセージ
          let message = `${field.label}は必須項目です`;
          if (field.type === "text" && field.name === "date") {
            message += "。「月/日」の形式で入力してください（例: 4/1）";
          } else if (field.type === "text" && field.name === "description") {
            message += "。取引内容を簡潔に記入してください（例: 商品仕入）";
          } else if (field.type === "number") {
            message += "。半角数字で入力してください";
          } else if (field.type === "dropdown") {
            message += "。プルダウンから選択してください";
          }
          errors.push(message);
        }
      });

      // 数値フィールドチェック
      Object.entries(answerData).forEach(([key, value]) => {
        const field = template.fields?.find(
          (f: QuestionField) => f.name === key,
        );
        if (field?.type === "number" && value !== null && value !== undefined) {
          if (typeof value !== "number" || isNaN(value)) {
            errors.push(`${field.label}は有効な数値を入力してください`);
          } else if (value < 0) {
            errors.push(`${field.label}は0以上の値を入力してください`);
          }
        }
      });

      // 勘定科目重複チェック（仕訳問題）
      if (question.category_id === "journal") {
        const accounts = Object.entries(answerData)
          .filter(([key, value]) => key.includes("account") && value)
          .map(([key, value]) => value);

        const uniqueAccounts = new Set(accounts);
        if (accounts.length !== uniqueAccounts.size) {
          errors.push("同じ勘定科目を複数回選択することはできません");
        }
      }
    } catch (parseError) {
      logger.error(
        "[AnswerService] テンプレート解析エラー:",
        parseError as Error,
      );
      errors.push("問題データの解析に失敗しました");
    }

    return errors;
  }

  /**
   * 伝票問題専用バリデーション
   */
  private validateVoucherAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate,
  ): string[] {
    const errors: string[] = [];
    const data = answerData as AnswerData & {
      voucher_type?: string;
      entries?: {
        account?: string;
        amount?: number;
        date?: string;
        description?: string;
        [key: string]: string | number | undefined;
      }[];
    };

    logger.debug("[AnswerService] 伝票バリデーション開始:", {
      details: { data, template },
    });

    // 基本構造チェック
    if (!data.voucher_type) {
      errors.push("伝票タイプが選択されていません");
    }

    if (!data.entries || !Array.isArray(data.entries)) {
      errors.push("伝票エントリが正しく入力されていません");
      return errors;
    }

    if (data.entries.length === 0) {
      errors.push("少なくとも1つの伝票エントリを入力してください");
      return errors;
    }

    // 各エントリの必須フィールドチェック
    data.entries.forEach((entry, index: number) => {
      template.fields?.forEach((field: QuestionField) => {
        const value = entry[field.name];
        if (
          field.required &&
          (value === null || value === undefined || value === "")
        ) {
          errors.push(
            `${index + 1}番目のエントリ: ${field.label}は必須項目です`,
          );
        }
      });

      // 金額の妥当性チェック
      if (entry.amount !== undefined) {
        if (typeof entry.amount !== "number" || isNaN(entry.amount)) {
          errors.push(
            `${index + 1}番目のエントリ: 金額は有効な数値を入力してください`,
          );
        } else if (entry.amount <= 0) {
          errors.push(
            `${index + 1}番目のエントリ: 金額は0より大きい値を入力してください`,
          );
        }
      }
    });

    logger.debug("[AnswerService] 伝票バリデーション完了:", {
      details: { errors },
    });
    return errors;
  }

  /**
   * 用語穴埋め問題（vocabulary）専用バリデーション
   */
  private validateVocabularyAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      blanks?: Array<{
        index: number;
        choices: string[];
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as AnswerData & {
      blanks?: Array<{
        index: number;
        selectedIndex: number;
      }>;
    };

    if (!data.blanks || data.blanks.length === 0) {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての空欄に解答が入力されているかチェック
    const templateBlanks = template.blanks || [];
    const unansweredBlanks = templateBlanks.filter(
      (blank) => !data.blanks?.some((b) => b.index === blank.index - 1),
    );

    if (unansweredBlanks.length > 0) {
      errors.push(
        `空欄 ${unansweredBlanks.map((b) => `(${b.index})`).join(", ")} に解答を選択してください`,
      );
    }

    return errors;
  }

  /**
   * 複数空欄選択問題専用バリデーション
   */
  private validateMultipleBlankChoiceAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      questions?: {
        id: string;
        label: string;
      }[];
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as AnswerData & {
      answers?: Record<string, string>;
    };

    logger.debug(
      "[AnswerService] Multiple blank choice validation - answerData:",
      { details: data },
    );
    logger.debug(
      "[AnswerService] Multiple blank choice validation - template:",
      { details: template },
    );

    // Check if answer data has the expected structure
    if (!data.answers || typeof data.answers !== "object") {
      errors.push("解答データの形式が正しくありません");
      return errors;
    }

    // Check if template has questions array
    if (
      !template.questions ||
      !Array.isArray(template.questions) ||
      template.questions.length === 0
    ) {
      errors.push("問題定義が正しくありません");
      return errors;
    }

    const userAnswers = data.answers;
    const requiredQuestions = template.questions;

    // Check if all required blanks are answered
    for (const question of requiredQuestions) {
      const questionId = question.id;
      const questionLabel = question.label;

      if (!userAnswers.hasOwnProperty(questionId)) {
        errors.push(`${questionLabel}が未回答です`);
      } else {
        const userAnswer = userAnswers[questionId];

        // Check if answer is not empty
        if (!userAnswer || typeof userAnswer !== "string") {
          errors.push(`${questionLabel}の回答が正しくありません`);
        }

        // Check if answer is a valid option (A, B, C, D, etc.)
        if (userAnswer && !/^[A-Z]$/.test(userAnswer)) {
          errors.push(`${questionLabel}の回答は選択肢から選択してください`);
        }
      }
    }

    logger.debug("[AnswerService] Multiple blank choice validation errors:", {
      details: errors,
    });
    return errors;
  }

  /**
   * 正解判定ロジック
   */
  public isAnswerCorrect(
    answerData: CBTAnswerData,
    question: Question,
  ): boolean {
    try {
      const correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

      // First check answer template for question type
      try {
        const answerTemplate = safeJsonParse<QuestionTemplate>(
          question.answer_template_json,
          {} as QuestionTemplate,
        );
        if (
          answerTemplate?.type === "single_choice" ||
          (answerTemplate?.type === "multiple_choice" &&
            !answerTemplate?.questions)
        ) {
          return this.isChoiceAnswerCorrect(
            answerData,
            correctAnswer,
            answerTemplate.type,
          );
        } else if (
          answerTemplate?.type === "multiple_choice" &&
          answerTemplate?.questions &&
          Array.isArray(answerTemplate.questions)
        ) {
          return this.isMultipleBlankChoiceAnswerCorrect(
            answerData,
            correctAnswer,
          );
        } else if (answerTemplate?.type === "journal_entry") {
          return this.isJournalAnswerCorrect(answerData, correctAnswer);
        } else if (
          answerTemplate?.type === "subsidiary_book" ||
          answerTemplate?.type === "ledger_account"
        ) {
          return this.isLedgerAnswerCorrect(answerData, correctAnswer);
        } else if (
          answerTemplate?.type === "financial_statement" ||
          answerTemplate?.type === "worksheet" ||
          answerTemplate?.type === "trial_balance"
        ) {
          return this.isTrialBalanceAnswerCorrect(answerData, correctAnswer);
        } else if (answerTemplate?.type === "voucher_entry") {
          return this.isVoucherAnswerCorrect(answerData, correctAnswer);
        } else if (answerTemplate?.type === "vocabulary") {
          return this.isVocabularyAnswerCorrect(answerData, correctAnswer);
        } else if (answerTemplate?.type === "fill_in_ledger") {
          return this.isFillInLedgerAnswerCorrect(answerData, correctAnswer);
        } else if (answerTemplate?.type === "auxiliary_book") {
          return this.isAuxiliaryBookAnswerCorrect(
            answerData,
            correctAnswer,
            answerTemplate,
          );
        } else if (answerTemplate?.type === "fill_in_trial_balance") {
          return this.isFillInTrialBalanceAnswerCorrect(
            answerData,
            correctAnswer,
            answerTemplate,
          );
        } else if (
          answerTemplate?.type === "fill_in_comprehensive_trial_balance"
        ) {
          return this.isFillInComprehensiveTrialBalanceAnswerCorrect(
            answerData,
            correctAnswer,
          );
        } else if (answerTemplate?.type === "fill_in_financial_statement") {
          return this.isFillInFinancialStatementAnswerCorrect(
            answerData,
            correctAnswer,
          );
        }
      } catch {}

      // Fall back to category-based routing
      switch (question.category_id) {
        case "journal":
          return this.isJournalAnswerCorrect(answerData, correctAnswer);
        case "ledger":
          return this.isLedgerAnswerCorrect(answerData, correctAnswer);
        case "trial_balance":
          return this.isTrialBalanceAnswerCorrect(answerData, correctAnswer);
        default:
          logger.error(
            `[AnswerService] 未対応のカテゴリ: ${question.category_id}`,
          );
          return false;
      }
    } catch (error) {
      logger.error("[AnswerService] 正解判定エラー:", error as Error);
      return false;
    }
  }

  /**
   * 仕訳問題の正解判定
   */
  private isJournalAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    // Check for new compound journal entries format (journalEntries array)
    if (
      correctAnswer.journalEntries &&
      Array.isArray(correctAnswer.journalEntries)
    ) {
      return this.isCompoundJournalEntriesCorrect(
        answerData,
        correctAnswer.journalEntries,
      );
    }

    const entry = correctAnswer.journalEntry;
    if (!entry) return false;

    const data = answerData as AnswerData & {
      debit_account?: string;
      debit_amount?: number;
      credit_account?: string;
      credit_amount?: number;
      debits?: { account: string; amount: number }[];
      credits?: { account: string; amount: number }[];
      journalEntry?: {
        debit?: { account: string; amount: number };
        credit?: { account: string; amount: number };
      };
    };

    // Check for UnifiedJournalEntryForm format: journalEntry.debit/credit
    if (
      data.journalEntry &&
      data.journalEntry.debit &&
      data.journalEntry.credit
    ) {
      const userDebit = data.journalEntry.debit;
      const userCredit = data.journalEntry.credit;

      const isCorrect =
        userDebit.account === entry.debit_account &&
        userDebit.amount === (entry as any).debit_amount &&
        userCredit.account === entry.credit_account &&
        userCredit.amount === (entry as any).credit_amount;

      return isCorrect;
    }

    // Check if the answer data is in the new array format (from JournalEntryForm)
    if (
      data.debits &&
      data.credits &&
      Array.isArray(data.debits) &&
      Array.isArray(data.credits)
    ) {
      return this.isMultipleJournalEntriesCorrect(
        {
          debits: data.debits,
          credits: data.credits,
        },
        correctAnswer,
      );
    }

    // Legacy format: single debit/credit entries
    const isCorrect =
      data.debit_account === entry.debit_account &&
      (data as any).debit_amount === (entry as any).debit_amount &&
      data.credit_account === entry.credit_account &&
      (data as any).credit_amount === (entry as any).credit_amount;
    return isCorrect;
  }

  /**
   * 複数仕訳エントリの正解判定（JournalEntryForm形式）
   */
  private isMultipleJournalEntriesCorrect(
    data: {
      debits: { account: string; amount: number }[];
      credits: { account: string; amount: number }[];
    },
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const entry = correctAnswer.journalEntry;
    if (!entry) return false;

    // Filter out empty entries (no account or zero amount)
    const validDebits = data.debits.filter((d) => d.account && d.amount > 0);
    const validCredits = data.credits.filter((c) => c.account && c.amount > 0);

    // For simple questions (single debit/credit), convert to arrays for comparison
    if (entry.debit_account && entry.credit_account) {
      const expectedDebits = [
        { account: entry.debit_account, amount: (entry as any).debit_amount },
      ];
      const expectedCredits = [
        { account: entry.credit_account, amount: (entry as any).credit_amount },
      ];

      return (
        this.compareJournalEntryArrays(validDebits, expectedDebits) &&
        this.compareJournalEntryArrays(validCredits, expectedCredits)
      );
    }

    // For complex questions with multiple entries (future implementation)
    if (
      "debits" in entry &&
      "credits" in entry &&
      entry.debits &&
      entry.credits
    ) {
      return (
        this.compareJournalEntryArrays(
          validDebits,
          entry.debits as { account: string; amount: number }[],
        ) &&
        this.compareJournalEntryArrays(
          validCredits,
          entry.credits as { account: string; amount: number }[],
        )
      );
    }

    return false;
  }

  /**
   * 仕訳エントリ配列の比較
   */
  private compareJournalEntryArrays(
    userEntries: { account: string; amount: number }[],
    correctEntries: { account: string; amount: number }[],
  ): boolean {
    if (userEntries.length !== correctEntries.length) {
      return false;
    }

    // Sort both arrays by account name for consistent comparison
    const sortedUser = [...userEntries].sort((a, b) =>
      a.account.localeCompare(b.account),
    );
    const sortedCorrect = [...correctEntries].sort((a, b) =>
      a.account.localeCompare(b.account),
    );

    // Compare each entry
    return sortedUser.every((userEntry, index) => {
      const correctEntry = sortedCorrect[index];
      return (
        userEntry.account === correctEntry.account &&
        userEntry.amount === correctEntry.amount
      );
    });
  }

  /**
   * 複合仕訳（journalEntries配列）の正解判定
   */
  private isCompoundJournalEntriesCorrect(
    answerData: CBTAnswerData,
    correctEntries: any[],
  ): boolean {
    const data = answerData as AnswerData & {
      debit_account?: string;
      debit_amount?: number;
      credit_account?: string;
      credit_amount?: number;
      debits?: { account: string; amount: number }[];
      credits?: { account: string; amount: number }[];
    };

    // Check if the answer data is in the new array format (from JournalEntryForm)
    if (
      data.debits &&
      data.credits &&
      Array.isArray(data.debits) &&
      Array.isArray(data.credits)
    ) {
      // Filter out empty entries
      const validDebits = data.debits.filter((d) => d.account && d.amount > 0);
      const validCredits = data.credits.filter(
        (c) => c.account && c.amount > 0,
      );

      // Convert correctEntries array to debits and credits arrays
      const expectedDebits = correctEntries
        .filter((entry) => entry.debit_account && entry.debit_amount > 0)
        .map((entry) => ({
          account: entry.debit_account,
          amount: entry.debit_amount,
        }));

      const expectedCredits = correctEntries
        .filter((entry) => entry.credit_account && entry.credit_amount > 0)
        .map((entry) => ({
          account: entry.credit_account,
          amount: entry.credit_amount,
        }));

      return (
        this.compareJournalEntryArrays(validDebits, expectedDebits) &&
        this.compareJournalEntryArrays(validCredits, expectedCredits)
      );
    }

    return false;
  }

  /**
   * 帳簿問題の正解判定
   */
  private isLedgerAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const entry = correctAnswer.ledgerEntry;
    if (!entry?.entries) return false;

    const data = answerData as AnswerData & {
      entries?: LedgerEntry[];
      date?: string;
      description?: string;
      debit_amount?: number;
      credit_amount?: number;
    };
    logger.debug("[AnswerService] Ledger validation - answerData:", {
      details: data,
    });
    logger.debug("[AnswerService] Ledger validation - correctAnswer:", {
      details: correctAnswer,
    });

    // Check if answer data contains multiple entries (new format)
    if (data.entries && Array.isArray(data.entries)) {
      return this.validateMultipleLedgerEntries(data.entries, entry.entries);
    }

    // Single entry format (legacy support)
    if (entry.entries.length === 1) {
      const correctEntry = entry.entries[0];

      // Match field names from answer template: date, description, debit_amount, credit_amount
      // with correct answer (handle both snake_case and camelCase)
      const userDate = (data as any).date;
      const userDescription = data.description;
      const userDebitAmount = (data as any).debit_amount || 0;
      const userCreditAmount = (data as any).credit_amount || 0;

      const correctDate = (correctEntry as any).date;
      const correctDescription = correctEntry.description;
      const correctDebitAmount = (correctEntry as any).debit_amount || 0;
      const correctCreditAmount = (correctEntry as any).credit_amount || 0;

      logger.debug("[AnswerService] Comparing single entry:", {
        details: {
          userDate,
          correctDate,
          userDescription,
          correctDescription,
          userDebitAmount,
          correctDebitAmount,
          userCreditAmount,
          correctCreditAmount,
        },
      });

      // Match all required fields
      const dateMatch = !correctDate || userDate === correctDate;
      const descMatch =
        !correctDescription ||
        userDescription?.includes(correctDescription) ||
        correctDescription?.includes(userDescription || "");
      const debitMatch = userDebitAmount === correctDebitAmount;
      const creditMatch = userCreditAmount === correctCreditAmount;

      logger.debug("[AnswerService] Single entry match results:", {
        details: {
          dateMatch,
          descMatch,
          debitMatch,
          creditMatch,
        },
      });

      return dateMatch && descMatch && debitMatch && creditMatch;
    }

    return false;
  }

  /**
   * 複数帳簿エントリの正解判定
   */
  private validateMultipleLedgerEntries(
    userEntries: LedgerEntry[],
    correctEntries: LedgerEntry[],
  ): boolean {
    logger.debug("[AnswerService] Validating multiple entries:", {
      details: {
        userEntries,
        correctEntries,
      },
    });

    if (userEntries.length !== correctEntries.length) {
      logger.debug(
        `[AnswerService] Entry count mismatch: user=${userEntries.length}, correct=${correctEntries.length}`,
      );
      return false;
    }

    // Sort both arrays by date for consistent comparison
    const sortedUserEntries = [...userEntries].sort(
      (a, b) => (a as any).date?.localeCompare((b as any).date || "") || 0,
    );
    const sortedCorrectEntries = [...correctEntries].sort((a, b) =>
      ((a as any).date || "").localeCompare((b as any).date || ""),
    );

    // Validate each entry
    for (let i = 0; i < sortedUserEntries.length; i++) {
      const userEntry = sortedUserEntries[i];
      const correctEntry = sortedCorrectEntries[i];

      // Extract values with support for different field naming conventions
      const userDate = (userEntry as any).date;
      const userDescription = userEntry.description;
      const userDebitAmount = (userEntry as any).debit_amount || 0;
      const userCreditAmount = (userEntry as any).credit_amount || 0;

      const correctDate = (correctEntry as any).date;
      const correctDescription = correctEntry.description;
      const correctDebitAmount = (correctEntry as any).debit_amount || 0;
      const correctCreditAmount = (correctEntry as any).credit_amount || 0;

      logger.debug("[AnswerService] Comparing entry ${i + 1}:", {
        details: {
          userDate,
          correctDate,
          userDescription,
          correctDescription,
          userDebitAmount,
          correctDebitAmount,
          userCreditAmount,
          correctCreditAmount,
        },
      });

      // Match fields for this entry
      const dateMatch = !correctDate || userDate === correctDate;
      const descMatch =
        !correctDescription ||
        userDescription?.includes(correctDescription) ||
        correctDescription?.includes(userDescription || "");
      const debitMatch = userDebitAmount === correctDebitAmount;
      const creditMatch = userCreditAmount === correctCreditAmount;

      logger.debug("[AnswerService] Entry ${i + 1} match results:", {
        details: {
          dateMatch,
          descMatch,
          debitMatch,
          creditMatch,
        },
      });

      if (!dateMatch || !descMatch || !debitMatch || !creditMatch) {
        return false;
      }
    }

    logger.debug("[AnswerService] All entries match - answer is correct");
    return true;
  }

  /**
   * 試算表問題の正解判定
   */
  private isTrialBalanceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    // Handle legacy format first (for backward compatibility)
    const balances = correctAnswer.trialBalance?.balances;
    if (balances) {
      const data = answerData as AnswerData;
      return Object.entries(balances).every(([account, amount]) => {
        return data[account] === amount;
      });
    }

    // Handle financialStatements format (Q_T_001など)
    const financialStatements = (
      correctAnswer as CorrectAnswer & {
        financialStatements?: {
          balanceSheet?: {
            assets?: FinancialStatementEntry[];
            liabilities?: FinancialStatementEntry[];
            equity?: FinancialStatementEntry[];
          };
          incomeStatement?: {
            revenues?: FinancialStatementEntry[];
            expenses?: FinancialStatementEntry[];
          };
        };
      }
    ).financialStatements;
    if (financialStatements) {
      // 財務諸表形式の場合は、entriesに変換
      const convertedEntries =
        this.convertFinancialStatementsToEntries(financialStatements);
      if (convertedEntries && convertedEntries.length > 0) {
        return this.compareTrialBalanceEntries(convertedEntries, answerData);
      }
    }

    // Handle new format: { entries: [...] }
    const correctEntries = (
      correctAnswer as CorrectAnswer & {
        entries?: TrialBalanceEntry[];
      }
    ).entries;
    if (!correctEntries || !Array.isArray(correctEntries)) {
      return false;
    }

    // Get user answer entries
    const data = answerData as AnswerData;
    const userEntries = data.entries;
    if (!userEntries || !Array.isArray(userEntries)) {
      return false;
    }

    // Convert both arrays to account balance maps for comparison
    const correctBalances =
      this.convertTrialBalanceEntriesToBalances(correctEntries);
    const userBalances = this.convertTrialBalanceEntriesToBalances(userEntries);

    // Compare all accounts
    const allAccounts = new Set([
      ...Object.keys(correctBalances),
      ...Object.keys(userBalances),
    ]);

    for (const account of Array.from(allAccounts)) {
      const correctBalance = correctBalances[account] || {
        debit: 0,
        credit: 0,
      };
      const userBalance = userBalances[account] || { debit: 0, credit: 0 };

      if (
        correctBalance.debit !== userBalance.debit ||
        correctBalance.credit !== userBalance.credit
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Convert trial balance entries to balance map for comparison
   */
  private convertTrialBalanceEntriesToBalances(
    entries: {
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }[],
  ): Record<string, { debit: number; credit: number }> {
    const balances: Record<string, { debit: number; credit: number }> = {};

    for (const entry of entries) {
      balances[entry.accountName] = {
        debit: entry.debitAmount || 0,
        credit: entry.creditAmount || 0,
      };
    }

    return balances;
  }

  /**
   * 財務諸表形式のデータを試算表エントリ形式に変換
   */
  private convertFinancialStatementsToEntries(
    financialStatements: any,
  ): { accountName: string; debitAmount: number; creditAmount: number }[] {
    const entries: {
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }[] = [];

    // 貸借対照表の資産（借方）
    if (financialStatements.balanceSheet?.assets) {
      for (const asset of financialStatements.balanceSheet.assets) {
        if (asset.amount > 0) {
          entries.push({
            accountName: asset.accountName,
            debitAmount: asset.amount,
            creditAmount: 0,
          });
        }
      }
    }

    // 貸借対照表の負債（貸方）
    if (financialStatements.balanceSheet?.liabilities) {
      for (const liability of financialStatements.balanceSheet.liabilities) {
        if (liability.amount > 0) {
          entries.push({
            accountName: liability.accountName,
            debitAmount: 0,
            creditAmount: liability.amount,
          });
        }
      }
    }

    // 貸借対照表の純資産（貸方）
    if (financialStatements.balanceSheet?.equity) {
      for (const equity of financialStatements.balanceSheet.equity) {
        // 当期純損失は借方
        if (equity.accountName === "当期純損失" && equity.amount > 0) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: equity.amount,
            creditAmount: 0,
          });
        } else if (equity.amount > 0) {
          entries.push({
            accountName: equity.accountName,
            debitAmount: 0,
            creditAmount: equity.amount,
          });
        }
      }
    }

    // 損益計算書の収益（貸方）
    if (financialStatements.incomeStatement?.revenues) {
      for (const revenue of financialStatements.incomeStatement.revenues) {
        if (revenue.amount > 0) {
          entries.push({
            accountName:
              revenue.accountName === "売上高" ? "売上" : revenue.accountName,
            debitAmount: 0,
            creditAmount: revenue.amount,
          });
        }
      }
    }

    // 損益計算書の費用（借方）
    if (financialStatements.incomeStatement?.expenses) {
      for (const expense of financialStatements.incomeStatement.expenses) {
        // 保険料が0の場合はスキップ
        if (expense.amount > 0) {
          entries.push({
            accountName: expense.accountName,
            debitAmount: expense.amount,
            creditAmount: 0,
          });
        }
      }
    }
    return entries;
  }

  /**
   * 試算表エントリの比較
   */
  private compareTrialBalanceEntries(
    correctEntries: {
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }[],
    answerData: CBTAnswerData,
  ): boolean {
    const data = answerData as AnswerData;
    const userEntries = data.entries;

    if (!userEntries || !Array.isArray(userEntries)) {
      return false;
    }

    // Convert both arrays to account balance maps for comparison
    const correctBalances =
      this.convertTrialBalanceEntriesToBalances(correctEntries);
    const userBalances = this.convertTrialBalanceEntriesToBalances(userEntries);

    // Compare all accounts
    const allAccounts = new Set([
      ...Object.keys(correctBalances),
      ...Object.keys(userBalances),
    ]);

    for (const account of Array.from(allAccounts)) {
      const correctBalance = correctBalances[account] || {
        debit: 0,
        credit: 0,
      };
      const userBalance = userBalances[account] || { debit: 0, credit: 0 };

      if (
        correctBalance.debit !== userBalance.debit ||
        correctBalance.credit !== userBalance.credit
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * 伝票問題の正解判定
   */
  private isVoucherAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const data = answerData as AnswerData;

    // 正答データのentriesと比較
    const correctVoucherAnswer = correctAnswer as CorrectAnswer & {
      voucher_type?: string;
      entries?: {
        date?: string;
        account?: string;
        amount?: number;
        description?: string;
      }[];
    };
    const correctVoucherType = correctVoucherAnswer.voucher_type;
    const correctEntries = correctVoucherAnswer.entries;

    if (!correctEntries || !Array.isArray(correctEntries)) {
      return false;
    }

    // ユーザーの解答データ
    const userVoucherType = data.voucher_type;
    const userEntries = data.entries;
    if (!userEntries || !Array.isArray(userEntries)) {
      return false;
    }

    // 伝票タイプの確認
    if (correctVoucherType && userVoucherType !== correctVoucherType) {
      return false;
    }

    // エントリ数の確認
    if (userEntries.length !== correctEntries.length) {
      return false;
    }

    // 各エントリの照合
    for (let i = 0; i < correctEntries.length; i++) {
      const correctEntry = correctEntries[i];

      // 同じデータを持つエントリを探す
      const matchingEntry = userEntries.find((userEntry: any) => {
        const dateMatch =
          !(correctEntry as any).date ||
          (userEntry as any).date === (correctEntry as any).date ||
          (userEntry as any).date ===
            (correctEntry as any).date.replace(/\//g, "/");

        const accountMatch =
          !correctEntry.account || userEntry.account === correctEntry.account;

        const amountMatch =
          correctEntry.amount === undefined ||
          Number(userEntry.amount) === Number(correctEntry.amount);

        const descriptionMatch =
          !correctEntry.description ||
          userEntry.description === correctEntry.description;
        return dateMatch && accountMatch && amountMatch && descriptionMatch;
      });

      if (!matchingEntry) {
        return false;
      }
    }
    return true;
  }

  /**
   * 選択問題の正解判定
   */
  private isChoiceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
    questionType: "single_choice" | "multiple_choice",
  ): boolean {
    const data = answerData as AnswerData;
    logger.debug("[AnswerService] Choice validation - answerData:", {
      details: data,
    });
    logger.debug("[AnswerService] Choice validation - correctAnswer:", {
      details: correctAnswer,
    });
    logger.debug("[AnswerService] Choice validation - questionType:", {
      details: questionType,
    });

    if (questionType === "single_choice") {
      // Single choice: compare selected option
      const userSelected = data.selected;
      const correctSelected = (
        correctAnswer as CorrectAnswer & {
          selected?: string;
        }
      ).selected;

      logger.debug("[AnswerService] Single choice comparison:", {
        details: {
          userSelected,
          correctSelected,
          match: userSelected === correctSelected,
        },
      });

      return userSelected === correctSelected;
    } else if (questionType === "multiple_choice") {
      // Multiple choice: compare selected options arrays
      const userSelectedOptions = data.selected_options;
      const correctSelectedOptions = (
        correctAnswer as CorrectAnswer & {
          selected_options?: string[];
        }
      ).selected_options;

      if (
        !Array.isArray(userSelectedOptions) ||
        !Array.isArray(correctSelectedOptions)
      ) {
        logger.error(
          "[AnswerService] Multiple choice validation: options are not arrays",
          new Error("Invalid options format"),
          {
            component: "AnswerService",
            userSelectedOptions,
            correctSelectedOptions,
          },
        );
        return false;
      }

      // Sort both arrays for consistent comparison
      const sortedUser = [...userSelectedOptions].sort();
      const sortedCorrect = [...correctSelectedOptions].sort();

      logger.debug("[AnswerService] Multiple choice comparison:", {
        details: {
          userSelectedOptions: sortedUser,
          correctSelectedOptions: sortedCorrect,
          lengthMatch: sortedUser.length === sortedCorrect.length,
        },
      });

      // Compare lengths and contents
      if (sortedUser.length !== sortedCorrect.length) {
        return false;
      }

      return sortedUser.every(
        (option, index) => option === sortedCorrect[index],
      );
    }

    return false;
  }

  /**
   * 複数空欄選択問題の正解判定
   */
  private isMultipleBlankChoiceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const data = answerData as AnswerData;

    logger.debug(
      "[AnswerService] Multiple blank choice validation - answerData:",
      { details: data },
    );
    logger.debug(
      "[AnswerService] Multiple blank choice validation - correctAnswer:",
      { details: correctAnswer },
    );

    // Check if answer data has the expected structure
    if (!data.answers || typeof data.answers !== "object") {
      logger.error(
        "[AnswerService] Multiple blank choice validation: answers object missing or invalid",
      );
      return false;
    }

    const userAnswers = data.answers;
    const correctAnswers = (
      correctAnswer as CorrectAnswer & {
        answers?: Record<string, string>;
      }
    ).answers;

    if (!correctAnswers || typeof correctAnswers !== "object") {
      logger.error(
        "[AnswerService] Multiple blank choice validation: correct answers object missing or invalid",
      );
      return false;
    }

    // Check if all required blanks are answered
    const correctAnswerKeys = Object.keys(correctAnswers);
    const userAnswerKeys = Object.keys(userAnswers);

    logger.debug(
      "[AnswerService] Multiple blank choice validation comparison:",
      {
        userAnswerKeys,
        correctAnswerKeys,
        userAnswers,
        correctAnswers,
      },
    );

    // Check if user answered all required blanks
    for (const key of correctAnswerKeys) {
      if (!(key in userAnswers)) {
        logger.debug("[AnswerService] Missing answer for blank: ${key}");
        return false;
      }
    }

    // Check if all answers are correct
    for (const key of correctAnswerKeys) {
      if (userAnswers[key] !== correctAnswers[key]) {
        logger.debug(
          `[AnswerService] Incorrect answer for blank ${key}: got '${userAnswers[key]}', expected '${correctAnswers[key]}'`,
        );
        return false;
      }
    }

    logger.debug(
      "[AnswerService] Multiple blank choice validation: all answers correct",
    );
    return true;
  }

  /**
   * 複数解答バッチ送信（模試用）
   */
  public async submitBatchAnswers(
    answers: SubmitAnswerRequest[],
    examId?: string,
  ): Promise<SubmitAnswerResponse[]> {
    const startTime = Date.now();
    const results: SubmitAnswerResponse[] = [];

    try {
      logger.debug("[AnswerService] バッチ解答送信開始: ${answers.length}件");

      // 同一セッションIDを使用
      const sessionId = examId || uuidv4();

      for (const answer of answers) {
        const result = await this.submitAnswer({
          ...answer,
          sessionId,
        });
        results.push(result);
      }

      const processTime = Date.now() - startTime;
      logger.debug(
        `[AnswerService] バッチ解答送信完了: ${answers.length}件, 処理時間=${processTime}ms`,
      );

      return results;
    } catch (error) {
      logger.error("[AnswerService] バッチ解答送信エラー:", error as Error);
      throw error;
    }
  }

  /**
   * セッション統計取得
   */
  public async getSessionStatistics(sessionId: string): Promise<{
    totalQuestions: number;
    correctAnswers: number;
    accuracyRate: number;
    totalTime: number;
    averageTime: number;
  }> {
    try {
      const history =
        await this.learningHistoryRepository.findBySessionId(sessionId);

      const totalQuestions = history.length;
      const correctAnswers = history.filter((h) => h.is_correct).length;
      const accuracyRate =
        totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
      const totalTime = history.reduce((sum, h) => sum + h.answer_time_ms, 0);
      const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

      return {
        totalQuestions,
        correctAnswers,
        accuracyRate,
        totalTime,
        averageTime,
      };
    } catch (error) {
      logger.error("[AnswerService] セッション統計取得エラー:", error as Error);
      throw error;
    }
  }

  /**
   * 用語穴埋め問題の正解判定
   */
  private isVocabularyAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    try {
      // answerData: { questionType: "vocabulary", blanks: [{index: 0, selectedIndex: 1}, ...] }
      // correctAnswer: { blanks: [{index: 0, correctIndex: 1}, ...] }
      const userBlanks = (answerData as any).blanks as Array<{
        index: number;
        selectedIndex: number;
      }>;
      const correctBlanks = (correctAnswer as any).blanks as Array<{
        index: number;
        correctIndex: number;
      }>;

      if (!userBlanks || !correctBlanks) {
        logger.error("[AnswerService] vocabulary問題のデータ形式が不正です");
        return false;
      }

      // すべての空欄が正解かチェック
      return correctBlanks.every((correctBlank) => {
        const userBlank = userBlanks.find(
          (b) => b.index === correctBlank.index,
        );
        if (!userBlank) {
          logger.debug(
            `[AnswerService] 空欄${correctBlank.index}の解答がありません`,
          );
          return false;
        }

        const isCorrect = userBlank.selectedIndex === correctBlank.correctIndex;
        logger.debug(
          `[AnswerService] 空欄${correctBlank.index}: user=${userBlank.selectedIndex}, correct=${correctBlank.correctIndex}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] vocabulary問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }

  /**
   * 勘定記入空欄補充問題（fill_in_ledger）専用バリデーション
   */
  private validateFillInLedgerAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      blanks?: Array<{
        index: number;
        choices: number[];
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    if (!data.blanks || !Array.isArray(data.blanks)) {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての空欄に解答が入力されているかチェック
    const templateBlanks = template.blanks || [];
    const unansweredBlanks = templateBlanks.filter(
      (blank) =>
        !data.blanks.some(
          (b: any) => b.index === blank.index && b.selectedValue !== undefined,
        ),
    );

    if (unansweredBlanks.length > 0) {
      errors.push(
        `空欄 ${unansweredBlanks.map((b) => `(${b.index + 1})`).join(", ")} に解答を選択してください`,
      );
    }

    return errors;
  }

  /**
   * 補助簿記入問題（auxiliary_book）専用バリデーション
   */
  private validateAuxiliaryBookAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      transactions?: Array<{
        index: number;
        description: string;
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    if (
      !data.auxiliaryBookSelections ||
      !Array.isArray(data.auxiliaryBookSelections)
    ) {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての取引に対して補助簿が選択されているかチェック
    const templateTransactions = template.transactions || [];
    const unansweredTransactions = templateTransactions.filter(
      (transaction) =>
        !data.auxiliaryBookSelections.some(
          (s: any) =>
            s.transactionIndex === transaction.index &&
            s.bookIds &&
            s.bookIds.length > 0,
        ),
    );

    if (unansweredTransactions.length > 0) {
      errors.push(
        `取引 ${unansweredTransactions.map((t) => t.index).join(", ")} について補助簿を選択してください`,
      );
    }

    return errors;
  }

  /**
   * 勘定記入空欄補充問題の正解判定
   */
  private isFillInLedgerAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    try {
      // answerData: { questionType: "ledger", blanks: [{index: 0, selectedIndex: 1, selectedValue: 1000}, ...] }
      // correctAnswer: { blanks: [{index: 0, correctIndex: 1}, ...] }
      const userBlanks = (answerData as any).blanks as Array<{
        index: number;
        selectedIndex: number;
        selectedValue: number;
      }>;
      const correctBlanks = (correctAnswer as any).blanks as Array<{
        index: number;
        correctIndex: number;
      }>;

      if (!userBlanks || !correctBlanks) {
        logger.error(
          "[AnswerService] fill_in_ledger問題のデータ形式が不正です",
        );
        return false;
      }

      // すべての空欄が正解かチェック
      return correctBlanks.every((correctBlank) => {
        const userBlank = userBlanks.find(
          (b) => b.index === correctBlank.index,
        );
        if (!userBlank) {
          logger.debug(
            `[AnswerService] 空欄${correctBlank.index}の解答がありません`,
          );
          return false;
        }

        const isCorrect = userBlank.selectedIndex === correctBlank.correctIndex;
        logger.debug(
          `[AnswerService] 空欄${correctBlank.index}: user=${userBlank.selectedIndex}, correct=${correctBlank.correctIndex}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] fill_in_ledger問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }

  /**
   * 補助簿記入問題の正解判定
   * Note: auxiliary_book問題では、正答データがanswer_template_jsonに埋め込まれている
   */
  private isAuxiliaryBookAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
    answerTemplate?: QuestionTemplate & {
      correctAnswers?: Array<{
        transactionIndex: number;
        bookIds: string[];
      }>;
    },
  ): boolean {
    try {
      // answerData: { questionType: "ledger", auxiliaryBookSelections: [{transactionIndex: 1, bookIds: ["cash_book"]}, ...] }
      const userSelections = (answerData as any)
        .auxiliaryBookSelections as Array<{
        transactionIndex: number;
        bookIds: string[];
      }>;

      if (!userSelections) {
        logger.error(
          "[AnswerService] auxiliary_book問題のユーザー解答データが不正です",
        );
        return false;
      }

      // 正答データは answer_template の correctAnswers から取得
      // （correct_answer_json ではなく answer_template_json に含まれている）
      const correctSelections = answerTemplate?.correctAnswers;

      if (!correctSelections) {
        logger.error(
          "[AnswerService] auxiliary_book問題の正答データが見つかりません",
        );
        return false;
      }

      // すべての取引が正解かチェック
      return correctSelections.every((correctSelection) => {
        const userSelection = userSelections.find(
          (s) => s.transactionIndex === correctSelection.transactionIndex,
        );
        if (!userSelection) {
          logger.debug(
            `[AnswerService] 取引${correctSelection.transactionIndex}の解答がありません`,
          );
          return false;
        }

        // 選択された補助簿をソートして比較
        const sortedUserBooks = [...(userSelection.bookIds || [])].sort();
        const sortedCorrectBooks = [...correctSelection.bookIds].sort();

        if (sortedUserBooks.length !== sortedCorrectBooks.length) {
          logger.debug(
            `[AnswerService] 取引${correctSelection.transactionIndex}: 補助簿数不一致 user=${sortedUserBooks.length}, correct=${sortedCorrectBooks.length}`,
          );
          return false;
        }

        const isCorrect = sortedUserBooks.every(
          (book, index) => book === sortedCorrectBooks[index],
        );
        logger.debug(
          `[AnswerService] 取引${correctSelection.transactionIndex}: user=${sortedUserBooks.join(",")}, correct=${sortedCorrectBooks.join(",")}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] auxiliary_book問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }

  /**
   * 試算表穴埋め問題専用バリデーション
   */
  private validateFillInTrialBalanceAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      blanks?: Array<{
        index: number;
        choices: number[];
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    if (!data.blanks || typeof data.blanks !== "object") {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての空欄に解答が入力されているかチェック
    const templateBlanks = template.blanks || [];
    const userBlanks = data.blanks as Record<number, number>;

    const unansweredBlanks = templateBlanks.filter(
      (blank) => userBlanks[blank.index] === undefined,
    );

    if (unansweredBlanks.length > 0) {
      errors.push(
        `空欄 ${unansweredBlanks.map((b) => `(${b.index + 1})`).join(", ")} に解答を選択してください`,
      );
    }

    return errors;
  }

  /**
   * 合計残高試算表穴埋め問題専用バリデーション
   */
  private validateFillInComprehensiveTrialBalanceAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      blanks?: Array<{
        accountIndex: number;
        column: string;
        choices: number[];
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    if (!data.blanks || typeof data.blanks !== "object") {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての空欄に解答が入力されているかチェック
    const templateBlanks = template.blanks || [];
    const userBlanks = data.blanks as Record<number, number>;

    const unansweredBlanks = templateBlanks.filter(
      (blank, index) => userBlanks[index] === undefined,
    );

    if (unansweredBlanks.length > 0) {
      errors.push(`空欄 ${unansweredBlanks.length}個 に解答を選択してください`);
    }

    return errors;
  }

  /**
   * 財務諸表穴埋め問題専用バリデーション
   */
  private validateFillInFinancialStatementAnswer(
    answerData: CBTAnswerData,
    template: QuestionTemplate & {
      blanks?: Array<{
        itemIndex: number;
        field: string;
        choices: (string | number)[];
      }>;
    },
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    if (!data.blanks || typeof data.blanks !== "object") {
      errors.push("解答が入力されていません");
      return errors;
    }

    // すべての空欄に解答が入力されているかチェック
    const templateBlanks = template.blanks || [];
    const userBlanks = data.blanks as Record<number, number>;

    const unansweredBlanks = templateBlanks.filter(
      (blank, index) => userBlanks[index] === undefined,
    );

    if (unansweredBlanks.length > 0) {
      errors.push(`空欄 ${unansweredBlanks.length}個 に解答を選択してください`);
    }

    return errors;
  }

  /**
   * 試算表穴埋め問題の正解判定
   */
  private isFillInTrialBalanceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
    answerTemplate: QuestionTemplate & {
      blanks?: Array<{ index: number; choices: number[] }>;
    },
  ): boolean {
    try {
      // answerData: { blanks: Record<number, number> }
      // correctAnswer: { blanks: Array<{index: number, correctIndex: number}> }
      const userBlanks = (answerData as any).blanks as Record<number, number>;
      const correctBlanks = (correctAnswer as any).blanks as Array<{
        index: number;
        correctIndex: number;
      }>;
      const templateBlanks = answerTemplate.blanks || [];

      if (!userBlanks || !correctBlanks || !templateBlanks) {
        logger.error(
          "[AnswerService] fill_in_trial_balance問題のデータ形式が不正です",
        );
        return false;
      }

      // すべての空欄が正解かチェック
      return correctBlanks.every((correctBlank, arrayIndex) => {
        // correct_answer_jsonの配列インデックスに対応するtemplateのblankIndexを取得
        const templateBlank = templateBlanks[arrayIndex];
        if (!templateBlank) {
          logger.error(
            `[AnswerService] template blanks[${arrayIndex}]が存在しません`,
          );
          return false;
        }

        const blankIndex = templateBlank.index;
        const userSelectedIndex = userBlanks[blankIndex];

        if (userSelectedIndex === undefined) {
          logger.debug(`[AnswerService] 空欄${blankIndex}の解答がありません`);
          return false;
        }

        const isCorrect = userSelectedIndex === correctBlank.correctIndex;
        logger.debug(
          `[AnswerService] 空欄${blankIndex} (array[${arrayIndex}]): user=${userSelectedIndex}, correct=${correctBlank.correctIndex}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] fill_in_trial_balance問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }

  /**
   * 合計残高試算表穴埋め問題の正解判定
   */
  private isFillInComprehensiveTrialBalanceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    try {
      // answerData: { blanks: Record<number, number> }
      // correctAnswer: { blanks: Array<{index: number, correctIndex: number}> }
      const userBlanks = (answerData as any).blanks as Record<number, number>;
      const correctBlanks = (correctAnswer as any).blanks as Array<{
        index: number;
        correctIndex: number;
      }>;

      if (!userBlanks || !correctBlanks) {
        logger.error(
          "[AnswerService] fill_in_comprehensive_trial_balance問題のデータ形式が不正です",
        );
        return false;
      }

      // すべての空欄が正解かチェック
      return correctBlanks.every((correctBlank) => {
        const userSelectedIndex = userBlanks[correctBlank.index];
        if (userSelectedIndex === undefined) {
          logger.debug(
            `[AnswerService] 空欄${correctBlank.index}の解答がありません`,
          );
          return false;
        }

        const isCorrect = userSelectedIndex === correctBlank.correctIndex;
        logger.debug(
          `[AnswerService] 空欄${correctBlank.index}: user=${userSelectedIndex}, correct=${correctBlank.correctIndex}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] fill_in_comprehensive_trial_balance問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }

  /**
   * 財務諸表穴埋め問題の正解判定
   */
  private isFillInFinancialStatementAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    try {
      // answerData: { blanks: Record<number, number> }
      // correctAnswer: { blanks: Array<{index: number, correctIndex: number}> }
      const userBlanks = (answerData as any).blanks as Record<number, number>;
      const correctBlanks = (correctAnswer as any).blanks as Array<{
        index: number;
        correctIndex: number;
      }>;

      if (!userBlanks || !correctBlanks) {
        logger.error(
          "[AnswerService] fill_in_financial_statement問題のデータ形式が不正です",
        );
        return false;
      }

      // すべての空欄が正解かチェック
      return correctBlanks.every((correctBlank) => {
        const userSelectedIndex = userBlanks[correctBlank.index];
        if (userSelectedIndex === undefined) {
          logger.debug(
            `[AnswerService] 空欄${correctBlank.index}の解答がありません`,
          );
          return false;
        }

        const isCorrect = userSelectedIndex === correctBlank.correctIndex;
        logger.debug(
          `[AnswerService] 空欄${correctBlank.index}: user=${userSelectedIndex}, correct=${correctBlank.correctIndex}, match=${isCorrect}`,
        );

        return isCorrect;
      });
    } catch (error) {
      logger.error(
        "[AnswerService] fill_in_financial_statement問題の正解判定エラー:",
        error as Error,
      );
      return false;
    }
  }
}

/**
 * 解答処理サービスのシングルトンインスタンス
 */
export const answerService = new AnswerService();
