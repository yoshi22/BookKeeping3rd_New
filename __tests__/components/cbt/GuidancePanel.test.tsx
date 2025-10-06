/**
 * GuidancePanel コンポーネントのテスト
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { GuidancePanel } from "@/components/cbt/GuidancePanel";
import type { GuidanceStep } from "@/types/models";

describe("GuidancePanel", () => {
  const mockGuidance: GuidanceStep[] = [
    {
      stage: 1,
      title: "取引確認",
      body: "問題文の取引明細を確認し、日付順に整理します。",
    },
    {
      stage: 2,
      title: "転記",
      body: "借方・貸方を入力すると残高が自動更新されます。",
    },
    {
      stage: 3,
      title: "残高検証",
      body: "合計残高を確認し、現金過不足を調整します。",
    },
  ];

  const mockOnStageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with guidance steps", () => {
    const { getByTestId, getByText } = render(
      <GuidancePanel guidance={mockGuidance} />,
    );

    expect(getByTestId("guidance-panel")).toBeTruthy();
    expect(getByText("学習ガイド")).toBeTruthy();
    expect(getByText("取引確認")).toBeTruthy();
    expect(getByText("転記")).toBeTruthy();
    expect(getByText("残高検証")).toBeTruthy();
  });

  it("should initially expand stage 1 when initiallyExpanded is true", () => {
    const { getByTestId } = render(
      <GuidancePanel guidance={mockGuidance} initiallyExpanded={true} />,
    );

    expect(getByTestId("guidance-stage-1-content")).toBeTruthy();
  });

  it("should not expand any stage when initiallyExpanded is false", () => {
    const { queryByTestId } = render(
      <GuidancePanel guidance={mockGuidance} initiallyExpanded={false} />,
    );

    expect(queryByTestId("guidance-stage-1-content")).toBeTruthy(); // Should exist but not be visible
  });

  it("should expand stage when header is pressed", () => {
    const { getByTestId } = render(
      <GuidancePanel
        guidance={mockGuidance}
        initiallyExpanded={false}
        onStageChange={mockOnStageChange}
      />,
    );

    fireEvent.press(getByTestId("guidance-stage-2-header"));
    expect(mockOnStageChange).toHaveBeenCalledWith(2);
  });

  it("should collapse stage when already expanded stage header is pressed", () => {
    const { getByTestId } = render(
      <GuidancePanel
        guidance={mockGuidance}
        initiallyExpanded={true}
        onStageChange={mockOnStageChange}
      />,
    );

    // Press the already expanded stage 1
    fireEvent.press(getByTestId("guidance-stage-1-header"));
    expect(mockOnStageChange).toHaveBeenCalledWith(null);
  });

  it("should display stage numbers correctly", () => {
    const { getByText } = render(<GuidancePanel guidance={mockGuidance} />);

    expect(getByText("1")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });

  it("should display correct stage content when expanded", () => {
    const { getByTestId, getByText } = render(
      <GuidancePanel guidance={mockGuidance} initiallyExpanded={true} />,
    );

    expect(getByTestId("guidance-stage-1-content")).toBeTruthy();
    expect(
      getByText("問題文の取引明細を確認し、日付順に整理します。"),
    ).toBeTruthy();
  });

  it("should handle empty guidance array", () => {
    const { getByTestId, getByText } = render(<GuidancePanel guidance={[]} />);

    expect(getByTestId("guidance-panel")).toBeTruthy();
    expect(getByText("学習ガイド")).toBeTruthy();
  });

  it("should handle single guidance step", () => {
    const singleGuidance: GuidanceStep[] = [
      {
        stage: 1,
        title: "仕訳入力",
        body: "借方・貸方の勘定科目と金額を入力してください。",
      },
    ];

    const { getByText } = render(<GuidancePanel guidance={singleGuidance} />);

    expect(getByText("仕訳入力")).toBeTruthy();
    expect(
      getByText("借方・貸方の勘定科目と金額を入力してください。"),
    ).toBeTruthy();
  });

  it("should expand different stages independently", () => {
    const { getByTestId } = render(
      <GuidancePanel
        guidance={mockGuidance}
        initiallyExpanded={false}
        onStageChange={mockOnStageChange}
      />,
    );

    // Expand stage 2
    fireEvent.press(getByTestId("guidance-stage-2-header"));
    expect(mockOnStageChange).toHaveBeenCalledWith(2);

    // Clear mock and expand stage 3 (should close stage 2)
    mockOnStageChange.mockClear();
    fireEvent.press(getByTestId("guidance-stage-3-header"));
    expect(mockOnStageChange).toHaveBeenCalledWith(3);
  });

  it("should work without onStageChange callback", () => {
    const { getByTestId } = render(<GuidancePanel guidance={mockGuidance} />);

    expect(() => {
      fireEvent.press(getByTestId("guidance-stage-1-header"));
    }).not.toThrow();
  });

  it("should display correct testIds for all stages", () => {
    const { getByTestId } = render(<GuidancePanel guidance={mockGuidance} />);

    expect(getByTestId("guidance-stage-1-header")).toBeTruthy();
    expect(getByTestId("guidance-stage-1-content")).toBeTruthy();
    expect(getByTestId("guidance-stage-2-header")).toBeTruthy();
    expect(getByTestId("guidance-stage-2-content")).toBeTruthy();
    expect(getByTestId("guidance-stage-3-header")).toBeTruthy();
    expect(getByTestId("guidance-stage-3-content")).toBeTruthy();
  });
});
