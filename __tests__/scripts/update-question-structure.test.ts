/**
 * CBTテンプレート生成スクリプトのテスト
 * update-question-structure.ts の単体テスト
 */

import {
  generateCBTTemplate,
  getPhaseAQuestions,
} from "../../scripts/data/update-question-structure";
import type { CBTAnswerTemplate } from "../../src/types/models";

describe("update-question-structure", () => {
  describe("getPhaseAQuestions", () => {
    it("should return correct number of Phase A questions", () => {
      const questions = getPhaseAQuestions();

      // Phase A: 第2問から10問 + 第3問から6問 = 16問
      expect(questions).toHaveLength(16);
    });

    it("should include Q_L_001 to Q_L_010 (ledger questions)", () => {
      const questions = getPhaseAQuestions();

      const ledgerQuestions = questions.filter((q) => q.startsWith("Q_L_"));
      expect(ledgerQuestions).toHaveLength(10);

      expect(questions).toContain("Q_L_001");
      expect(questions).toContain("Q_L_010");
    });

    it("should include Q_T_001 to Q_T_006 (trial balance questions)", () => {
      const questions = getPhaseAQuestions();

      const trialQuestions = questions.filter((q) => q.startsWith("Q_T_"));
      expect(trialQuestions).toHaveLength(6);

      expect(questions).toContain("Q_T_001");
      expect(questions).toContain("Q_T_006");
    });

    it("should return questions in expected format", () => {
      const questions = getPhaseAQuestions();

      questions.forEach((questionId) => {
        expect(questionId).toMatch(/^Q_(L|T)_\d{3}$/);
      });
    });
  });

  describe("generateCBTTemplate", () => {
    describe("General Ledger Templates (Q_L_001-010)", () => {
      it("should generate general_ledger template for Q_L_001", () => {
        const template = generateCBTTemplate("Q_L_001");

        expect(template).toBeDefined();
        expect(template!.template_type).toBe("general_ledger");
        expect(template!.layout_variant).toBe("ledger_A");
        expect(template!.allowed_accounts).toContain("現金");
        expect(template!.allowed_accounts).toContain("現金過不足");
      });

      it("should have correct columns for general ledger template", () => {
        const template = generateCBTTemplate("Q_L_005");

        expect(template).toBeDefined();
        expect(template!.columns).toHaveLength(5);

        const columnKeys = template!.columns.map((col) => col.key);
        expect(columnKeys).toEqual([
          "date",
          "description",
          "debit",
          "credit",
          "balance",
        ]);
      });

      it("should have balance column with auto-calculation formula", () => {
        const template = generateCBTTemplate("Q_L_003");

        expect(template).toBeDefined();
        const balanceColumn = template!.columns.find(
          (col) => col.key === "balance",
        );

        expect(balanceColumn).toBeDefined();
        expect(balanceColumn!.input).toBe("computed");
        expect(balanceColumn!.formula).toBe("prev + debit - credit");
      });

      it("should have proper rows with locked first row", () => {
        const template = generateCBTTemplate("Q_L_007");

        expect(template).toBeDefined();
        expect(template!.rows).toHaveLength(5);

        const firstRow = template!.rows[0];
        expect(firstRow.locked).toBe(true);
        expect(firstRow.label).toBe("前月繰越");

        const secondRow = template!.rows[1];
        expect(secondRow.locked).toBe(false);
        expect(secondRow.label).toBe("取引1");
      });

      it("should include proper guidance steps", () => {
        const template = generateCBTTemplate("Q_L_009");

        expect(template).toBeDefined();
        expect(template!.guidance).toHaveLength(3);

        expect(template!.guidance[0].stage).toBe(1);
        expect(template!.guidance[0].title).toBe("取引確認");

        expect(template!.guidance[1].stage).toBe(2);
        expect(template!.guidance[1].title).toBe("転記");

        expect(template!.guidance[2].stage).toBe(3);
        expect(template!.guidance[2].title).toBe("残高検証");
      });
    });

    describe("Trial Balance Templates (Q_T_001-006)", () => {
      it("should generate trial_balance_simple template for Q_T_001", () => {
        const template = generateCBTTemplate("Q_T_001");

        expect(template).toBeDefined();
        expect(template!.template_type).toBe("trial_balance_simple");
        expect(template!.layout_variant).toBe("trial_v1");
        expect(template!.allowed_accounts).toContain("現金");
        expect(template!.allowed_accounts).toContain("商品");
      });

      it("should have correct columns for trial balance template", () => {
        const template = generateCBTTemplate("Q_T_003");

        expect(template).toBeDefined();
        expect(template!.columns).toHaveLength(3);

        const columnKeys = template!.columns.map((col) => col.key);
        expect(columnKeys).toEqual(["accountName", "debit", "credit"]);
      });

      it("should have proper allowed accounts for trial balance", () => {
        const template = generateCBTTemplate("Q_T_004");

        expect(template).toBeDefined();
        const expectedAccounts = [
          "現金",
          "売掛金",
          "商品",
          "建物",
          "買掛金",
          "売上",
          "仕入",
          "給料",
        ];

        expectedAccounts.forEach((account) => {
          expect(template!.allowed_accounts).toContain(account);
        });
      });

      it("should include proper guidance for trial balance", () => {
        const template = generateCBTTemplate("Q_T_002");

        expect(template).toBeDefined();
        expect(template!.guidance).toHaveLength(3);

        expect(template!.guidance[0].stage).toBe(1);
        expect(template!.guidance[0].title).toBe("整理事項確認");

        expect(template!.guidance[1].stage).toBe(2);
        expect(template!.guidance[1].title).toBe("勘定別集計");

        expect(template!.guidance[2].stage).toBe(3);
        expect(template!.guidance[2].title).toBe("借貸平均確認");
      });
    });

    describe("Invalid Question IDs", () => {
      it("should return null for invalid question ID format", () => {
        expect(generateCBTTemplate("INVALID_001")).toBeNull();
        expect(generateCBTTemplate("Q_X_001")).toBeNull();
        expect(generateCBTTemplate("")).toBeNull();
      });

      it("should return null for out-of-range question numbers", () => {
        expect(generateCBTTemplate("Q_L_011")).toBeNull(); // 範囲外
        expect(generateCBTTemplate("Q_T_007")).toBeNull(); // 範囲外
        expect(generateCBTTemplate("Q_L_000")).toBeNull(); // 0は無効
      });

      it("should return null for unsupported question types", () => {
        // 第2問・第3問以外は未対応
        expect(generateCBTTemplate("Q_J_001")).toBeNull();
        expect(generateCBTTemplate("Q_M_001")).toBeNull();
      });
    });

    describe("Template Validation", () => {
      it("should generate templates with required validation rules", () => {
        const template = generateCBTTemplate("Q_L_001");

        expect(template).toBeDefined();
        expect(template!.validation_rules).toContain("required_fields");
        expect(template!.validation_rules).toContain("balance_check");
      });

      it("should set auto_calculate to true for all templates", () => {
        const ledgerTemplate = generateCBTTemplate("Q_L_005");
        const trialTemplate = generateCBTTemplate("Q_T_003");

        expect(ledgerTemplate!.auto_calculate).toBe(true);
        expect(trialTemplate!.auto_calculate).toBe(true);
      });

      it("should set appropriate max_rows for templates", () => {
        const ledgerTemplate = generateCBTTemplate("Q_L_008");
        const trialTemplate = generateCBTTemplate("Q_T_003"); // Q_T_005 returns extended type which is not defined

        expect(ledgerTemplate!.max_rows).toBe(10);
        expect(trialTemplate!.max_rows).toBe(20);
      });
    });

    describe("Consistency Across Templates", () => {
      it("should generate consistent templates for same question type", () => {
        const template1 = generateCBTTemplate("Q_L_001");
        const template2 = generateCBTTemplate("Q_L_005");

        expect(template1!.template_type).toBe(template2!.template_type);
        expect(template1!.layout_variant).toBe(template2!.layout_variant);
        expect(template1!.columns.length).toBe(template2!.columns.length);
        expect(template1!.rows.length).toBe(template2!.rows.length);
      });

      it("should have different allowed_accounts based on question type", () => {
        const ledgerTemplate = generateCBTTemplate("Q_L_002");
        const trialTemplate = generateCBTTemplate("Q_T_002");

        // General ledger has fewer, more specific accounts
        expect(ledgerTemplate!.allowed_accounts.length).toBeLessThan(
          trialTemplate!.allowed_accounts.length,
        );

        // Both should include basic accounts
        expect(ledgerTemplate!.allowed_accounts).toContain("現金");
        expect(trialTemplate!.allowed_accounts).toContain("現金");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed question IDs gracefully", () => {
      const malformedIds = [
        "Q_L",
        "Q_L_",
        "Q_L_abc",
        "Q_L_1",
        "Q_L_12",
        "Q__001",
        "_L_001",
      ];

      malformedIds.forEach((id) => {
        expect(generateCBTTemplate(id)).toBeNull();
      });
    });

    it("should maintain data integrity for all valid inputs", () => {
      const phaseAQuestions = getPhaseAQuestions();

      phaseAQuestions.forEach((questionId) => {
        const template = generateCBTTemplate(questionId);

        expect(template).toBeDefined();
        expect(template!.template_type).toBeTruthy();
        expect(template!.layout_variant).toBeTruthy();
        expect(template!.allowed_accounts.length).toBeGreaterThan(0);
        expect(template!.columns.length).toBeGreaterThan(0);
        expect(template!.rows.length).toBeGreaterThan(0);
        expect(template!.guidance.length).toBeGreaterThan(0);
      });
    });
  });
});
