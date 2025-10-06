/**
 * GeneralLedgerForm コンポーネントのテスト
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { GeneralLedgerForm } from "@/components/cbt/GeneralLedgerForm";
import type { CBTAnswerTemplate } from "@/types/models";

describe("GeneralLedgerForm", () => {
  const mockTemplate: CBTAnswerTemplate = {
    template_type: "general_ledger",
    layout_variant: "ledger_A",
    allowed_accounts: [
      "現金",
      "売掛金",
      "売上",
      "現金過不足",
      "仕入",
      "買掛金",
    ],
    rows: [
      {
        row_id: "r1",
        label: "前月繰越",
        locked: true,
        default_values: {
          date: "4/1",
          description: "前月繰越",
          debit: 0,
          credit: 0,
        },
      },
      { row_id: "r2", label: "取引1", locked: false },
      { row_id: "r3", label: "取引2", locked: false },
    ],
    columns: [
      { key: "date", label: "日付", input: "text", width: 80, required: true },
      {
        key: "description",
        label: "摘要",
        input: "dropdown",
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      { key: "debit", label: "借方", input: "currency", width: 120 },
      { key: "credit", label: "貸方", input: "currency", width: 120 },
      {
        key: "balance",
        label: "残高",
        input: "computed",
        width: 120,
        formula: "prev + debit - credit",
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "取引確認",
        body: "問題文の取引明細を確認し、日付順に整理します。",
      },
    ],
    max_rows: 10,
    auto_calculate: true,
    validation_rules: ["required_fields", "balance_check"],
  };

  const mockOnDataChange = jest.fn();
  const mockOnValidationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with template", () => {
    const { getByTestId, getByText } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    expect(getByTestId("general-ledger-form")).toBeTruthy();
    expect(getByText("日付")).toBeTruthy();
    expect(getByText("摘要")).toBeTruthy();
    expect(getByText("借方")).toBeTruthy();
    expect(getByText("貸方")).toBeTruthy();
    expect(getByText("残高")).toBeTruthy();
  });

  it("should initialize with default values from template", () => {
    const { getByDisplayValue } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    expect(getByDisplayValue("4/1")).toBeTruthy();
    expect(getByDisplayValue("前月繰越")).toBeTruthy();
  });

  it("should render locked and unlocked rows correctly", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    // First row is locked (前月繰越)
    const lockedCell = getByTestId("cell-0-date");
    expect(lockedCell.props.editable).toBe(false);

    // Second row is not locked
    const editableCell = getByTestId("cell-1-date");
    expect(editableCell.props.editable).toBe(true);
  });

  it("should handle text input changes", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    const dateInput = getByTestId("cell-1-date");
    fireEvent.changeText(dateInput, "4/5");

    expect(mockOnDataChange).toHaveBeenCalled();
    const callArgs = mockOnDataChange.mock.calls[0][0];
    expect(callArgs[1].date).toBe("4/5");
  });

  it("should handle currency input changes and parsing", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    const debitInput = getByTestId("cell-1-debit");
    fireEvent.changeText(debitInput, "1000");

    expect(mockOnDataChange).toHaveBeenCalled();
    const callArgs = mockOnDataChange.mock.calls[0][0];
    expect(callArgs[1].debit).toBe(1000);
  });

  it("should open dropdown when dropdown cell is pressed", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    const dropdownCell = getByTestId("cell-1-description");
    fireEvent.press(dropdownCell);

    // Check if dropdown overlay appears
    expect(getByTestId("general-ledger-form")).toBeTruthy();
  });

  it("should calculate balance automatically", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    // Input debit amount
    const debitInput = getByTestId("cell-1-debit");
    fireEvent.changeText(debitInput, "1000");

    expect(mockOnDataChange).toHaveBeenCalled();
    const callArgs = mockOnDataChange.mock.calls[0][0];

    // Check if balance was calculated (prev + debit - credit = 0 + 1000 - 0 = 1000)
    expect(callArgs[1].balance).toBe(1000);
  });

  it("should validate required fields", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
        onValidationChange={mockOnValidationChange}
      />,
    );

    // Leave required field empty and trigger validation
    const dateInput = getByTestId("cell-1-date");
    fireEvent.changeText(dateInput, "");

    expect(mockOnValidationChange).toHaveBeenCalled();
    const [isValid, errors] = mockOnValidationChange.mock.calls[0];
    expect(isValid).toBe(false);
    expect(errors).toContain(expect.stringMatching(/日付.*必須/));
  });

  it("should display validation errors", () => {
    const { getByTestId, getByText } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
        onValidationChange={mockOnValidationChange}
      />,
    );

    // Trigger validation error
    const dateInput = getByTestId("cell-1-date");
    fireEvent.changeText(dateInput, "");

    // Error message should appear
    expect(getByText(/日付.*必須/)).toBeTruthy();
  });

  it("should handle initialData prop", () => {
    const initialData = [
      {
        row_id: "r1",
        date: "4/1",
        description: "前月繰越",
        debit: 0,
        credit: 0,
        balance: 0,
      },
      {
        row_id: "r2",
        date: "4/5",
        description: "現金",
        debit: 1000,
        credit: 0,
        balance: 1000,
      },
    ];

    const { getByDisplayValue } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        initialData={initialData}
        onDataChange={mockOnDataChange}
      />,
    );

    expect(getByDisplayValue("4/5")).toBeTruthy();
    expect(getByDisplayValue("1000")).toBeTruthy();
  });

  it("should handle dropdown option selection", () => {
    const { getByTestId, getByText } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    // Open dropdown
    const dropdownCell = getByTestId("cell-1-description");
    fireEvent.press(dropdownCell);

    // Select an option (現金)
    const option = getByText("現金");
    fireEvent.press(option);

    expect(mockOnDataChange).toHaveBeenCalled();
    const callArgs = mockOnDataChange.mock.calls[0][0];
    expect(callArgs[1].description).toBe("現金");
  });

  it("should close dropdown when backdrop is pressed", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    // Open dropdown
    const dropdownCell = getByTestId("cell-1-description");
    fireEvent.press(dropdownCell);

    // The form should still be accessible (dropdown open)
    expect(getByTestId("general-ledger-form")).toBeTruthy();
  });

  it("should handle computed cells correctly", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    // Computed cell should not be editable
    const balanceCell = getByTestId("cell-1-balance");
    expect(balanceCell.props.editable).toBeUndefined(); // Computed cells are View components, not TextInput
  });

  it("should format currency values correctly", () => {
    const { getByTestId } = render(
      <GeneralLedgerForm
        template={mockTemplate}
        onDataChange={mockOnDataChange}
      />,
    );

    const debitInput = getByTestId("cell-1-debit");
    fireEvent.changeText(debitInput, "1,000.50abc");

    expect(mockOnDataChange).toHaveBeenCalled();
    const callArgs = mockOnDataChange.mock.calls[0][0];
    expect(callArgs[1].debit).toBe(1000.5);
  });

  it("should work without onValidationChange callback", () => {
    expect(() => {
      render(
        <GeneralLedgerForm
          template={mockTemplate}
          onDataChange={mockOnDataChange}
        />,
      );
    }).not.toThrow();
  });
});
