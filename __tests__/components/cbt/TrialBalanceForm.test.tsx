/**
 * TrialBalanceForm コンポーネントのテスト
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { TrialBalanceForm } from "@/components/cbt/TrialBalanceForm";
import type { CBTAnswerTemplate } from "@/types/models";

describe("TrialBalanceForm", () => {
  const mockSimpleTemplate: CBTAnswerTemplate = {
    template_type: "trial_balance_simple",
    layout_variant: "trial_v1",
    allowed_accounts: [
      "現金",
      "売掛金",
      "商品",
      "建物",
      "買掛金",
      "売上",
      "仕入",
    ],
    rows: [
      { row_id: "r1", label: "現金", locked: false },
      { row_id: "r2", label: "売掛金", locked: false },
      { row_id: "r3", label: "商品", locked: false },
      { row_id: "r4", label: "建物", locked: false },
      { row_id: "r5", label: "買掛金", locked: false },
    ],
    columns: [
      {
        key: "accountName",
        label: "勘定科目",
        input: "text",
        width: 160,
        required: true,
      },
      { key: "debit", label: "借方", input: "currency", width: 120 },
      { key: "credit", label: "貸方", input: "currency", width: 120 },
    ],
    guidance: [
      {
        stage: 1,
        title: "整理事項確認",
        body: "決算整理事項を順番に確認します。",
      },
    ],
    max_rows: 20,
    auto_calculate: true,
    validation_rules: ["required_fields", "balance_check"],
  };

  const mockExtendedTemplate: CBTAnswerTemplate = {
    template_type: "trial_balance_extended",
    layout_variant: "trial_v2",
    allowed_accounts: [
      "現金",
      "売掛金",
      "商品",
      "建物",
      "買掛金",
      "売上",
      "仕入",
    ],
    rows: [
      { row_id: "r1", label: "現金", locked: false },
      { row_id: "r2", label: "売掛金", locked: false },
      { row_id: "r3", label: "商品", locked: false },
    ],
    columns: [
      {
        key: "accountName",
        label: "勘定科目",
        input: "text",
        width: 140,
        required: true,
      },
      { key: "trialDebit", label: "試算表借方", input: "currency", width: 100 },
      {
        key: "trialCredit",
        label: "試算表貸方",
        input: "currency",
        width: 100,
      },
      { key: "adjustDebit", label: "修正借方", input: "currency", width: 100 },
      { key: "adjustCredit", label: "修正貸方", input: "currency", width: 100 },
      { key: "finalDebit", label: "決算借方", input: "computed", width: 100 },
      { key: "finalCredit", label: "決算貸方", input: "computed", width: 100 },
    ],
    guidance: [
      {
        stage: 1,
        title: "修正仕訳",
        body: "決算整理仕訳を修正欄に入力します。",
      },
    ],
    max_rows: 20,
    auto_calculate: true,
    validation_rules: ["required_fields", "balance_check"],
  };

  const mockOnDataChange = jest.fn();
  const mockOnValidationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Simple Layout (3-column)", () => {
    it("should render correctly with simple template", () => {
      const { getByTestId, getByText } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      expect(getByTestId("trial-balance-form")).toBeTruthy();
      expect(getByText("勘定科目")).toBeTruthy();
      expect(getByText("借方")).toBeTruthy();
      expect(getByText("貸方")).toBeTruthy();
    });

    it("should initialize with account names from template rows", () => {
      const { getByDisplayValue } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      expect(getByDisplayValue("現金")).toBeTruthy();
      expect(getByDisplayValue("売掛金")).toBeTruthy();
      expect(getByDisplayValue("商品")).toBeTruthy();
    });

    it("should handle currency input and call onDataChange", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "100000");

      expect(mockOnDataChange).toHaveBeenCalled();
      const callArgs = mockOnDataChange.mock.calls[0][0];
      expect(callArgs[0].debit).toBe(100000);
    });

    it("should calculate totals automatically", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "100000");

      const creditInput = getByTestId("cell-1-credit");
      fireEvent.changeText(creditInput, "50000");

      expect(mockOnDataChange).toHaveBeenCalled();
      const callArgs =
        mockOnDataChange.mock.calls[mockOnDataChange.mock.calls.length - 1][0];

      // Check if totals are calculated
      expect(callArgs.some((row: any) => row.row_id === "total-row")).toBe(
        true,
      );
    });

    it("should show balance status correctly when balanced", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      // Input equal amounts to both debit and credit
      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "100000");

      const creditInput = getByTestId("cell-0-credit");
      fireEvent.changeText(creditInput, "100000");

      expect(getByTestId("balance-status-balanced")).toBeTruthy();
    });

    it("should show balance status correctly when not balanced", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      // Input different amounts to debit and credit
      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "100000");

      const creditInput = getByTestId("cell-0-credit");
      fireEvent.changeText(creditInput, "50000");

      expect(getByTestId("balance-status-unbalanced")).toBeTruthy();
    });
  });

  describe("Extended Layout (7-column)", () => {
    it("should render correctly with extended template", () => {
      const { getByTestId, getByText } = render(
        <TrialBalanceForm
          template={mockExtendedTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      expect(getByTestId("trial-balance-form")).toBeTruthy();
      expect(getByText("勘定科目")).toBeTruthy();
      expect(getByText("試算表借方")).toBeTruthy();
      expect(getByText("試算表貸方")).toBeTruthy();
      expect(getByText("修正借方")).toBeTruthy();
      expect(getByText("修正貸方")).toBeTruthy();
      expect(getByText("決算借方")).toBeTruthy();
      expect(getByText("決算貸方")).toBeTruthy();
    });

    it("should calculate final amounts automatically in extended layout", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockExtendedTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      // Input trial balance amounts
      const trialDebitInput = getByTestId("cell-0-trialDebit");
      fireEvent.changeText(trialDebitInput, "100000");

      // Input adjustment amounts
      const adjustDebitInput = getByTestId("cell-0-adjustDebit");
      fireEvent.changeText(adjustDebitInput, "10000");

      expect(mockOnDataChange).toHaveBeenCalled();
      const callArgs =
        mockOnDataChange.mock.calls[mockOnDataChange.mock.calls.length - 1][0];

      // Check if final amount is calculated (100000 + 10000 = 110000)
      expect(callArgs[0].finalDebit).toBe(110000);
    });

    it("should handle adjustment entries section", () => {
      const { getByTestId, getByText } = render(
        <TrialBalanceForm
          template={mockExtendedTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      expect(getByText("修正仕訳")).toBeTruthy();
      expect(getByTestId("adjustment-section")).toBeTruthy();
    });
  });

  describe("Common Functionality", () => {
    it("should validate required fields", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
          onValidationChange={mockOnValidationChange}
        />,
      );

      // Clear required field
      const accountInput = getByTestId("cell-0-accountName");
      fireEvent.changeText(accountInput, "");

      expect(mockOnValidationChange).toHaveBeenCalled();
      const [isValid, errors] = mockOnValidationChange.mock.calls[0];
      expect(isValid).toBe(false);
      expect(errors).toContain(expect.stringMatching(/勘定科目.*必須/));
    });

    it("should display validation errors", () => {
      const { getByTestId, getByText } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
          onValidationChange={mockOnValidationChange}
        />,
      );

      // Trigger validation error
      const accountInput = getByTestId("cell-0-accountName");
      fireEvent.changeText(accountInput, "");

      // Error message should appear
      expect(getByText(/勘定科目.*必須/)).toBeTruthy();
    });

    it("should handle initialData prop", () => {
      const initialData = [
        {
          row_id: "r1",
          accountName: "現金",
          debit: 100000,
          credit: 0,
        },
        {
          row_id: "r2",
          accountName: "売掛金",
          debit: 50000,
          credit: 0,
        },
      ];

      const { getByDisplayValue } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          initialData={initialData}
          onDataChange={mockOnDataChange}
        />,
      );

      expect(getByDisplayValue("100000")).toBeTruthy();
      expect(getByDisplayValue("50000")).toBeTruthy();
    });

    it("should format currency values correctly", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "1,000,000.50abc");

      expect(mockOnDataChange).toHaveBeenCalled();
      const callArgs = mockOnDataChange.mock.calls[0][0];
      expect(callArgs[0].debit).toBe(1000000.5);
    });

    it("should work without onValidationChange callback", () => {
      expect(() => {
        render(
          <TrialBalanceForm
            template={mockSimpleTemplate}
            onDataChange={mockOnDataChange}
          />,
        );
      }).not.toThrow();
    });

    it("should handle empty currency input", () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      const debitInput = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput, "");

      expect(mockOnDataChange).toHaveBeenCalled();
      const callArgs = mockOnDataChange.mock.calls[0][0];
      expect(callArgs[0].debit).toBe(0);
    });

    it("should calculate totals correctly with multiple entries", async () => {
      const { getByTestId } = render(
        <TrialBalanceForm
          template={mockSimpleTemplate}
          onDataChange={mockOnDataChange}
        />,
      );

      // Add multiple debit entries
      const debitInput1 = getByTestId("cell-0-debit");
      fireEvent.changeText(debitInput1, "100000");

      const debitInput2 = getByTestId("cell-1-debit");
      fireEvent.changeText(debitInput2, "50000");

      // Add credit entry
      const creditInput = getByTestId("cell-2-credit");
      fireEvent.changeText(creditInput, "150000");

      await waitFor(() => {
        expect(mockOnDataChange).toHaveBeenCalled();
      });

      const callArgs =
        mockOnDataChange.mock.calls[mockOnDataChange.mock.calls.length - 1][0];
      const totalRow = callArgs.find((row: any) => row.row_id === "total-row");

      expect(totalRow).toBeDefined();
      expect(totalRow.debit).toBe(150000); // 100000 + 50000
      expect(totalRow.credit).toBe(150000);
    });
  });
});
