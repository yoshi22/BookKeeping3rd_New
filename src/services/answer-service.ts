/**
 * 解答処理サービス
 * Step 2.2: 解答記録機能実装
 * CBT形式解答の送信・判定・記録を統合管理
 */

import { CBTAnswerData, SessionType } from "../types/database";
import { Question, QuestionCorrectAnswer } from "../types/models";
import {
  learningHistoryRepository,
  CBTAnswerRecord,
} from "../data/repositories/learning-history-repository";
import { questionRepository } from "../data/repositories/question-repository";
import { reviewService, ReviewUpdateResult } from "./review-service";
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
  /**
   * 解答送信処理
   */
  public async submitAnswer(
    request: SubmitAnswerRequest,
  ): Promise<SubmitAnswerResponse> {
    const startProcessTime = Date.now();

    try {
      console.log(`[AnswerService] 解答送信開始: ${request.questionId}`);

      // 1. 問題データ取得
      const question = await questionRepository.findById(request.questionId);
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

      console.log(`[DEBUG] submitAnswer - バリデーション結果`, {
        questionId: request.questionId,
        validationErrors: validationErrors,
        answerData: request.answerData,
      });

      // 4. 正解判定
      const isCorrect =
        validationErrors.length === 0 &&
        this.isAnswerCorrect(request.answerData, question);

      console.log(`[DEBUG] submitAnswer - 正解判定結果`, {
        questionId: request.questionId,
        validationErrorsLength: validationErrors.length,
        isCorrect: isCorrect,
        validationPassed: validationErrors.length === 0,
      });

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
        await learningHistoryRepository.recordAnswer(answerRecord);

      // 7. 統計キャッシュ無効化
      statisticsCache.invalidateOnAnswerSubmit();

      // 8. 復習状況更新（学習・復習セッションのみ）
      let reviewUpdate: ReviewUpdateResult | undefined;
      if (
        request.sessionType === "learning" ||
        request.sessionType === "review"
      ) {
        try {
          console.log(
            `[AnswerService] 復習状況更新開始: questionId=${request.questionId}, isCorrect=${isCorrect}, sessionType=${request.sessionType}`,
          );
          reviewUpdate = await reviewService.updateReviewStatus(
            request.questionId,
            isCorrect,
            answerTimeMs,
          );
          console.log(
            `[AnswerService] 復習状況更新完了: ${reviewUpdate.action} - ${reviewUpdate.message}`,
          );
          console.log(
            `[AnswerService] 復習状況更新詳細: previousStatus=${reviewUpdate.previousStatus}, newStatus=${reviewUpdate.newStatus}, previousPriority=${reviewUpdate.previousPriority}, newPriority=${reviewUpdate.newPriority}`,
          );
        } catch (reviewError) {
          console.error("[AnswerService] 復習状況更新エラー:", reviewError);
          console.error("[AnswerService] Error details:", {
            message:
              reviewError instanceof Error ? reviewError.message : reviewError,
            stack: reviewError instanceof Error ? reviewError.stack : undefined,
          });
          // 復習状況更新エラーは致命的ではないため、処理を継続
        }
      } else {
        console.log(
          `[AnswerService] 復習状況更新スキップ: sessionType=${request.sessionType} (学習・復習セッションではない)`,
        );
      }

      // 9. 正解データ取得
      const correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

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
      console.log(
        `[AnswerService] 解答送信完了: ${request.questionId}, 正解=${isCorrect}, 処理時間=${processTime}ms`,
      );

      return response;
    } catch (error) {
      console.error(`[AnswerService] 解答送信エラー:`, error);
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
      const template = JSON.parse(question.answer_template_json);

      // 伝票問題の場合は専用バリデーションを使用
      if (template.type === "voucher_entry") {
        return this.validateVoucherAnswer(answerData, template);
      }

      // 複数空欄選択問題の場合は専用バリデーションを使用
      if (
        template.type === "multiple_choice" &&
        template.questions &&
        Array.isArray(template.questions)
      ) {
        return this.validateMultipleBlankChoiceAnswer(answerData, template);
      }

      // 必須フィールドチェック
      template.fields?.forEach((field: any) => {
        const value = (answerData as any)[field.name];
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
        const field = template.fields?.find((f: any) => f.name === key);
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
      console.error("[AnswerService] テンプレート解析エラー:", parseError);
      errors.push("問題データの解析に失敗しました");
    }

    return errors;
  }

  /**
   * 伝票問題専用バリデーション
   */
  private validateVoucherAnswer(
    answerData: CBTAnswerData,
    template: any,
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    console.log("[AnswerService] 伝票バリデーション開始:", { data, template });

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
    data.entries.forEach((entry: any, index: number) => {
      template.fields?.forEach((field: any) => {
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

    console.log("[AnswerService] 伝票バリデーション完了:", { errors });
    return errors;
  }

  /**
   * 複数空欄選択問題専用バリデーション
   */
  private validateMultipleBlankChoiceAnswer(
    answerData: CBTAnswerData,
    template: any,
  ): string[] {
    const errors: string[] = [];
    const data = answerData as any;

    console.log(
      "[AnswerService] Multiple blank choice validation - answerData:",
      data,
    );
    console.log(
      "[AnswerService] Multiple blank choice validation - template:",
      template,
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

    console.log(
      "[AnswerService] Multiple blank choice validation errors:",
      errors,
    );
    return errors;
  }

  /**
   * 正解判定ロジック
   */
  public isAnswerCorrect(
    answerData: CBTAnswerData,
    question: Question,
  ): boolean {
    console.log("[DEBUG] isAnswerCorrect - 開始", {
      questionId: question.id,
      categoryId: question.category_id,
      correctAnswerJson: question.correct_answer_json,
      answerDataKeys: Object.keys(answerData),
      answerData: answerData,
    });

    try {
      const correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

      console.log("[DEBUG] isAnswerCorrect - パース成功", {
        questionId: question.id,
        parsedCorrectAnswer: correctAnswer,
      });

      // First check answer template for question type
      try {
        const answerTemplate = JSON.parse(question.answer_template_json);
        if (
          answerTemplate?.type === "single_choice" ||
          (answerTemplate?.type === "multiple_choice" &&
            !answerTemplate?.questions)
        ) {
          console.log(
            `[DEBUG] isAnswerCorrect - choice問題として処理: ${answerTemplate.type}`,
            question.id,
          );
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
          console.log(
            "[DEBUG] isAnswerCorrect - multiple_blank_choice問題として処理",
            question.id,
          );
          return this.isMultipleBlankChoiceAnswerCorrect(
            answerData,
            correctAnswer,
          );
        } else if (answerTemplate?.type === "voucher_entry") {
          console.log(
            "[DEBUG] isAnswerCorrect - voucher_entry問題として処理",
            question.id,
          );
          return this.isVoucherAnswerCorrect(answerData, correctAnswer);
        }
      } catch (templateError) {
        console.warn(
          "[DEBUG] answer_template_json解析失敗、カテゴリベース判定に移行:",
          templateError,
        );
      }

      // Fall back to category-based routing
      switch (question.category_id) {
        case "journal":
          console.log(
            "[DEBUG] isAnswerCorrect - journal分岐に入る",
            question.id,
          );
          return this.isJournalAnswerCorrect(answerData, correctAnswer);
        case "ledger":
          console.log(
            "[DEBUG] isAnswerCorrect - ledger分岐に入る",
            question.id,
          );
          return this.isLedgerAnswerCorrect(answerData, correctAnswer);
        case "trial_balance":
          console.log(
            "[DEBUG] isAnswerCorrect - trial_balance分岐に入る",
            question.id,
          );
          return this.isTrialBalanceAnswerCorrect(answerData, correctAnswer);
        default:
          console.error(
            `[AnswerService] 未対応のカテゴリ: ${question.category_id}`,
          );
          return false;
      }
    } catch (error) {
      console.error("[AnswerService] 正解判定エラー:", error);
      console.error("[DEBUG] isAnswerCorrect - パースエラー詳細", {
        questionId: question.id,
        correctAnswerJson: question.correct_answer_json,
        error: error,
      });
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
    const entry = correctAnswer.journalEntry;
    if (!entry) return false;

    const data = answerData as any;

    console.log("[DEBUG] isJournalAnswerCorrect - 仕訳答え合わせデバッグ:", {
      questionId: data.questionId || "不明",
      userAnswer: {
        debit_account: data.debit_account,
        debit_amount: data.debit_amount,
        credit_account: data.credit_account,
        credit_amount: data.credit_amount,
      },
      correctAnswer: {
        debit_account: entry.debit_account,
        debit_amount: entry.debit_amount,
        credit_account: entry.credit_account,
        credit_amount: entry.credit_amount,
      },
      typeComparison: {
        debit_account_type: `${typeof data.debit_account} vs ${typeof entry.debit_account}`,
        debit_amount_type: `${typeof data.debit_amount} vs ${typeof entry.debit_amount}`,
        credit_account_type: `${typeof data.credit_account} vs ${typeof entry.credit_account}`,
        credit_amount_type: `${typeof data.credit_amount} vs ${typeof entry.credit_amount}`,
      },
      detailedMatch: {
        debit_account_match: data.debit_account === entry.debit_account,
        debit_amount_match: data.debit_amount === entry.debit_amount,
        credit_account_match: data.credit_account === entry.credit_account,
        credit_amount_match: data.credit_amount === entry.credit_amount,
      },
    });

    // Check if the answer data is in the new array format (from JournalEntryForm)
    if (
      data.debits &&
      data.credits &&
      Array.isArray(data.debits) &&
      Array.isArray(data.credits)
    ) {
      console.log("[DEBUG] Using new array format validation");
      return this.isMultipleJournalEntriesCorrect(data, correctAnswer);
    }

    // Legacy format: single debit/credit entries
    const isCorrect =
      data.debit_account === entry.debit_account &&
      data.debit_amount === entry.debit_amount &&
      data.credit_account === entry.credit_account &&
      data.credit_amount === entry.credit_amount;

    console.log(`[DEBUG] Legacy format validation result: ${isCorrect}`);
    return isCorrect;
  }

  /**
   * 複数仕訳エントリの正解判定（JournalEntryForm形式）
   */
  private isMultipleJournalEntriesCorrect(
    data: {
      debits: Array<{ account: string; amount: number }>;
      credits: Array<{ account: string; amount: number }>;
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
        { account: entry.debit_account, amount: entry.debit_amount },
      ];
      const expectedCredits = [
        { account: entry.credit_account, amount: entry.credit_amount },
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
          entry.debits as Array<{ account: string; amount: number }>,
        ) &&
        this.compareJournalEntryArrays(
          validCredits,
          entry.credits as Array<{ account: string; amount: number }>,
        )
      );
    }

    return false;
  }

  /**
   * 仕訳エントリ配列の比較
   */
  private compareJournalEntryArrays(
    userEntries: Array<{ account: string; amount: number }>,
    correctEntries: Array<{ account: string; amount: number }>,
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
   * 帳簿問題の正解判定
   */
  private isLedgerAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const entry = correctAnswer.ledgerEntry;
    if (!entry?.entries) return false;

    const data = answerData as any;
    console.log("[AnswerService] Ledger validation - answerData:", data);
    console.log(
      "[AnswerService] Ledger validation - correctAnswer:",
      correctAnswer,
    );

    // Check if answer data contains multiple entries (new format)
    if (data.entries && Array.isArray(data.entries)) {
      return this.validateMultipleLedgerEntries(data.entries, entry.entries);
    }

    // Single entry format (legacy support)
    if (entry.entries.length === 1) {
      const correctEntry = entry.entries[0];

      // Match field names from answer template: date, description, debit_amount, credit_amount
      // with correct answer (handle both snake_case and camelCase)
      const userDate = data.date;
      const userDescription = data.description;
      const userDebitAmount = data.debit_amount || 0;
      const userCreditAmount = data.credit_amount || 0;

      const correctDate = (correctEntry as any).date;
      const correctDescription = (correctEntry as any).description;
      const correctDebitAmount =
        (correctEntry as any).debitAmount ||
        (correctEntry as any).debit_amount ||
        0;
      const correctCreditAmount =
        (correctEntry as any).creditAmount ||
        (correctEntry as any).credit_amount ||
        0;

      console.log("[AnswerService] Comparing single entry:", {
        userDate,
        correctDate,
        userDescription,
        correctDescription,
        userDebitAmount,
        correctDebitAmount,
        userCreditAmount,
        correctCreditAmount,
      });

      // Match all required fields
      const dateMatch = !correctDate || userDate === correctDate;
      const descMatch =
        !correctDescription ||
        userDescription?.includes(correctDescription) ||
        correctDescription?.includes(userDescription);
      const debitMatch = userDebitAmount === correctDebitAmount;
      const creditMatch = userCreditAmount === correctCreditAmount;

      console.log("[AnswerService] Single entry match results:", {
        dateMatch,
        descMatch,
        debitMatch,
        creditMatch,
      });

      return dateMatch && descMatch && debitMatch && creditMatch;
    }

    return false;
  }

  /**
   * 複数帳簿エントリの正解判定
   */
  private validateMultipleLedgerEntries(
    userEntries: any[],
    correctEntries: any[],
  ): boolean {
    console.log("[AnswerService] Validating multiple entries:", {
      userEntries,
      correctEntries,
    });

    if (userEntries.length !== correctEntries.length) {
      console.log(
        `[AnswerService] Entry count mismatch: user=${userEntries.length}, correct=${correctEntries.length}`,
      );
      return false;
    }

    // Sort both arrays by date for consistent comparison
    const sortedUserEntries = [...userEntries].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const sortedCorrectEntries = [...correctEntries].sort((a, b) =>
      (a.date || "").localeCompare(b.date || ""),
    );

    // Validate each entry
    for (let i = 0; i < sortedUserEntries.length; i++) {
      const userEntry = sortedUserEntries[i];
      const correctEntry = sortedCorrectEntries[i];

      // Extract values with support for different field naming conventions
      const userDate = userEntry.date;
      const userDescription = userEntry.description;
      const userDebitAmount = userEntry.debit_amount || 0;
      const userCreditAmount = userEntry.credit_amount || 0;

      const correctDate = (correctEntry as any).date;
      const correctDescription = (correctEntry as any).description;
      const correctDebitAmount =
        (correctEntry as any).debitAmount ||
        (correctEntry as any).debit_amount ||
        0;
      const correctCreditAmount =
        (correctEntry as any).creditAmount ||
        (correctEntry as any).credit_amount ||
        0;

      console.log(`[AnswerService] Comparing entry ${i + 1}:`, {
        userDate,
        correctDate,
        userDescription,
        correctDescription,
        userDebitAmount,
        correctDebitAmount,
        userCreditAmount,
        correctCreditAmount,
      });

      // Match fields for this entry
      const dateMatch = !correctDate || userDate === correctDate;
      const descMatch =
        !correctDescription ||
        userDescription?.includes(correctDescription) ||
        correctDescription?.includes(userDescription);
      const debitMatch = userDebitAmount === correctDebitAmount;
      const creditMatch = userCreditAmount === correctCreditAmount;

      console.log(`[AnswerService] Entry ${i + 1} match results:`, {
        dateMatch,
        descMatch,
        debitMatch,
        creditMatch,
      });

      if (!dateMatch || !descMatch || !debitMatch || !creditMatch) {
        return false;
      }
    }

    console.log("[AnswerService] All entries match - answer is correct");
    return true;
  }

  /**
   * 試算表問題の正解判定
   */
  private isTrialBalanceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    console.log("[DEBUG] isTrialBalanceAnswerCorrect - 開始", {
      answerData,
      correctAnswer,
    });

    // Handle legacy format first (for backward compatibility)
    const balances = correctAnswer.trialBalance?.balances;
    if (balances) {
      console.log("[DEBUG] Using legacy trialBalance.balances format");
      const data = answerData as any;
      return Object.entries(balances).every(([account, amount]) => {
        return data[account] === amount;
      });
    }

    // Handle financialStatements format (Q_T_001など)
    const financialStatements = (correctAnswer as any).financialStatements;
    if (financialStatements) {
      console.log("[DEBUG] Using financialStatements format");
      // 財務諸表形式の場合は、entriesに変換
      const convertedEntries =
        this.convertFinancialStatementsToEntries(financialStatements);
      if (convertedEntries && convertedEntries.length > 0) {
        return this.compareTrialBalanceEntries(convertedEntries, answerData);
      }
    }

    // Handle new format: { entries: [...] }
    const correctEntries = (correctAnswer as any).entries;
    if (!correctEntries || !Array.isArray(correctEntries)) {
      console.error("[DEBUG] No valid entries found in correctAnswer");
      return false;
    }

    // Get user answer entries
    const data = answerData as any;
    const userEntries = data.entries;
    if (!userEntries || !Array.isArray(userEntries)) {
      console.error("[DEBUG] No valid entries found in user answer");
      return false;
    }

    console.log("[DEBUG] Comparing entries format:", {
      correctEntries: correctEntries.length,
      userEntries: userEntries.length,
    });

    // Convert both arrays to account balance maps for comparison
    const correctBalances =
      this.convertTrialBalanceEntriesToBalances(correctEntries);
    const userBalances = this.convertTrialBalanceEntriesToBalances(userEntries);

    console.log("[DEBUG] Balance comparison:", {
      correctBalances,
      userBalances,
    });

    // Compare all accounts
    const allAccounts = new Set([
      ...Object.keys(correctBalances),
      ...Object.keys(userBalances),
    ]);

    for (const account of allAccounts) {
      const correctBalance = correctBalances[account] || {
        debit: 0,
        credit: 0,
      };
      const userBalance = userBalances[account] || { debit: 0, credit: 0 };

      if (
        correctBalance.debit !== userBalance.debit ||
        correctBalance.credit !== userBalance.credit
      ) {
        console.log(`[DEBUG] Mismatch for account ${account}:`, {
          correct: correctBalance,
          user: userBalance,
        });
        return false;
      }
    }

    console.log("[DEBUG] All trial balance entries match");
    return true;
  }

  /**
   * Convert trial balance entries to balance map for comparison
   */
  private convertTrialBalanceEntriesToBalances(
    entries: Array<{
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }>,
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
  ): Array<{ accountName: string; debitAmount: number; creditAmount: number }> {
    const entries: Array<{
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }> = [];

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

    console.log(
      "[DEBUG] convertFinancialStatementsToEntries - 変換結果:",
      entries,
    );
    return entries;
  }

  /**
   * 試算表エントリの比較
   */
  private compareTrialBalanceEntries(
    correctEntries: Array<{
      accountName: string;
      debitAmount: number;
      creditAmount: number;
    }>,
    answerData: CBTAnswerData,
  ): boolean {
    const data = answerData as any;
    const userEntries = data.entries;

    if (!userEntries || !Array.isArray(userEntries)) {
      console.error("[DEBUG] No valid entries found in user answer");
      return false;
    }

    console.log("[DEBUG] Comparing entries:", {
      correctEntries: correctEntries.length,
      userEntries: userEntries.length,
    });

    // Convert both arrays to account balance maps for comparison
    const correctBalances =
      this.convertTrialBalanceEntriesToBalances(correctEntries);
    const userBalances = this.convertTrialBalanceEntriesToBalances(userEntries);

    console.log("[DEBUG] Balance comparison:", {
      correctBalances,
      userBalances,
    });

    // Compare all accounts
    const allAccounts = new Set([
      ...Object.keys(correctBalances),
      ...Object.keys(userBalances),
    ]);

    for (const account of allAccounts) {
      const correctBalance = correctBalances[account] || {
        debit: 0,
        credit: 0,
      };
      const userBalance = userBalances[account] || { debit: 0, credit: 0 };

      if (
        correctBalance.debit !== userBalance.debit ||
        correctBalance.credit !== userBalance.credit
      ) {
        console.log(`[DEBUG] Mismatch for account ${account}:`, {
          correct: correctBalance,
          user: userBalance,
        });
        return false;
      }
    }

    console.log("[DEBUG] All trial balance entries match");
    return true;
  }

  /**
   * 伝票問題の正解判定
   */
  private isVoucherAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const data = answerData as any;
    console.log("[DEBUG] isVoucherAnswerCorrect - 開始");
    console.log(
      "[DEBUG] Voucher validation - answerData:",
      JSON.stringify(data, null, 2),
    );
    console.log(
      "[DEBUG] Voucher validation - correctAnswer:",
      JSON.stringify(correctAnswer, null, 2),
    );

    // 正答データのentriesと比較
    const correctVoucherType = (correctAnswer as any).voucher_type;
    const correctEntries = (correctAnswer as any).entries;

    if (!correctEntries || !Array.isArray(correctEntries)) {
      console.error("[DEBUG] 正答データのentriesが見つかりません", {
        correctAnswer: correctAnswer,
        correctEntries: correctEntries,
      });
      return false;
    }

    // ユーザーの解答データ
    const userVoucherType = data.voucher_type;
    const userEntries = data.entries;

    console.log("[DEBUG] データ構造確認:", {
      userVoucherType: userVoucherType,
      correctVoucherType: correctVoucherType,
      userEntriesLength: userEntries?.length,
      correctEntriesLength: correctEntries?.length,
    });

    if (!userEntries || !Array.isArray(userEntries)) {
      console.error("[DEBUG] ユーザー解答のentriesが見つかりません", {
        data: data,
        userEntries: userEntries,
        dataKeys: Object.keys(data),
      });
      return false;
    }

    // 伝票タイプの確認
    if (correctVoucherType && userVoucherType !== correctVoucherType) {
      console.log(
        `[DEBUG] 伝票タイプが異なります: user='${userVoucherType}', correct='${correctVoucherType}'`,
      );
      return false;
    }

    // エントリ数の確認
    if (userEntries.length !== correctEntries.length) {
      console.log(
        `[DEBUG] エントリ数が異なります: user=${userEntries.length}, correct=${correctEntries.length}`,
      );
      return false;
    }

    // 各エントリの照合
    for (let i = 0; i < correctEntries.length; i++) {
      const correctEntry = correctEntries[i];

      console.log(`[DEBUG] エントリ ${i + 1} の照合開始:`, {
        correctEntry: correctEntry,
        userEntriesForMatching: userEntries,
      });

      // 同じデータを持つエントリを探す
      const matchingEntry = userEntries.find((userEntry: any) => {
        const dateMatch =
          !correctEntry.date ||
          userEntry.date === correctEntry.date ||
          userEntry.date === correctEntry.date.replace(/\//g, "/");

        const accountMatch =
          !correctEntry.account || userEntry.account === correctEntry.account;

        const amountMatch =
          correctEntry.amount === undefined ||
          Number(userEntry.amount) === Number(correctEntry.amount);

        const descriptionMatch =
          !correctEntry.description ||
          userEntry.description === correctEntry.description;

        console.log(`[DEBUG] エントリ照合詳細 (${i + 1}):`, {
          userEntry: userEntry,
          correctEntry: correctEntry,
          dateMatch: dateMatch,
          accountMatch: accountMatch,
          amountMatch: amountMatch,
          descriptionMatch: descriptionMatch,
          overallMatch:
            dateMatch && accountMatch && amountMatch && descriptionMatch,
        });

        return dateMatch && accountMatch && amountMatch && descriptionMatch;
      });

      if (!matchingEntry) {
        console.log(`[DEBUG] 一致するエントリが見つかりません (${i + 1}):`, {
          correctEntry: correctEntry,
          searchedUserEntries: userEntries,
        });
        return false;
      }
    }

    console.log("[DEBUG] 全ての伝票エントリが一致しました");
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
    const data = answerData as any;
    console.log("[AnswerService] Choice validation - answerData:", data);
    console.log(
      "[AnswerService] Choice validation - correctAnswer:",
      correctAnswer,
    );
    console.log(
      "[AnswerService] Choice validation - questionType:",
      questionType,
    );

    if (questionType === "single_choice") {
      // Single choice: compare selected option
      const userSelected = data.selected;
      const correctSelected = (correctAnswer as any).selected;

      console.log("[AnswerService] Single choice comparison:", {
        userSelected,
        correctSelected,
        match: userSelected === correctSelected,
      });

      return userSelected === correctSelected;
    } else if (questionType === "multiple_choice") {
      // Multiple choice: compare selected options arrays
      const userSelectedOptions = data.selected_options;
      const correctSelectedOptions = (correctAnswer as any).selected_options;

      if (
        !Array.isArray(userSelectedOptions) ||
        !Array.isArray(correctSelectedOptions)
      ) {
        console.error(
          "[AnswerService] Multiple choice validation: options are not arrays",
          {
            userSelectedOptions,
            correctSelectedOptions,
          },
        );
        return false;
      }

      // Sort both arrays for consistent comparison
      const sortedUser = [...userSelectedOptions].sort();
      const sortedCorrect = [...correctSelectedOptions].sort();

      console.log("[AnswerService] Multiple choice comparison:", {
        userSelectedOptions: sortedUser,
        correctSelectedOptions: sortedCorrect,
        lengthMatch: sortedUser.length === sortedCorrect.length,
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
    const data = answerData as any;

    console.log(
      "[AnswerService] Multiple blank choice validation - answerData:",
      data,
    );
    console.log(
      "[AnswerService] Multiple blank choice validation - correctAnswer:",
      correctAnswer,
    );

    // Check if answer data has the expected structure
    if (!data.answers || typeof data.answers !== "object") {
      console.error(
        "[AnswerService] Multiple blank choice validation: answers object missing or invalid",
      );
      return false;
    }

    const userAnswers = data.answers;
    const correctAnswers = (correctAnswer as any).answers;

    if (!correctAnswers || typeof correctAnswers !== "object") {
      console.error(
        "[AnswerService] Multiple blank choice validation: correct answers object missing or invalid",
      );
      return false;
    }

    // Check if all required blanks are answered
    const correctAnswerKeys = Object.keys(correctAnswers);
    const userAnswerKeys = Object.keys(userAnswers);

    console.log(
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
        console.log(`[AnswerService] Missing answer for blank: ${key}`);
        return false;
      }
    }

    // Check if all answers are correct
    for (const key of correctAnswerKeys) {
      if (userAnswers[key] !== correctAnswers[key]) {
        console.log(
          `[AnswerService] Incorrect answer for blank ${key}: got '${userAnswers[key]}', expected '${correctAnswers[key]}'`,
        );
        return false;
      }
    }

    console.log(
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
      console.log(`[AnswerService] バッチ解答送信開始: ${answers.length}件`);

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
      console.log(
        `[AnswerService] バッチ解答送信完了: ${answers.length}件, 処理時間=${processTime}ms`,
      );

      return results;
    } catch (error) {
      console.error("[AnswerService] バッチ解答送信エラー:", error);
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
        await learningHistoryRepository.findBySessionId(sessionId);

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
      console.error("[AnswerService] セッション統計取得エラー:", error);
      throw error;
    }
  }
}

/**
 * 解答処理サービスのシングルトンインスタンス
 */
export const answerService = new AnswerService();
