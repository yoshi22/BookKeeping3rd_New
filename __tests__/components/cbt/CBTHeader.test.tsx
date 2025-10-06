/**
 * CBTHeader コンポーネントのテスト
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CBTHeader } from "@/components/cbt/CBTHeader";

describe("CBTHeader", () => {
  const mockProps = {
    sectionNumber: 2 as const,
    questionIndex: 3,
    totalQuestions: 10,
    timeRemaining: 1200, // 20分
    isMarked: false,
    onBackPress: jest.fn(),
    onMarkToggle: jest.fn(),
    onTimeUp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with basic props", () => {
    const { getByTestId, getByText } = render(<CBTHeader {...mockProps} />);

    expect(getByTestId("cbt-header")).toBeTruthy();
    expect(getByText("第2問 4/10")).toBeTruthy();
    expect(getByText("20:00")).toBeTruthy();
  });

  it("should display section number and question progress correctly", () => {
    const { getByTestId } = render(
      <CBTHeader
        {...mockProps}
        sectionNumber={1}
        questionIndex={0}
        totalQuestions={5}
      />,
    );

    expect(getByTestId("cbt-header-section")).toHaveTextContent("第1問 1/5");
  });

  it("should format time correctly in MM:SS format", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} timeRemaining={3665} />,
    );

    expect(getByTestId("cbt-header-timer")).toHaveTextContent("61:05");
  });

  it("should show warning color when time is low", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} timeRemaining={300} />,
    );

    const timer = getByTestId("cbt-header-timer");
    expect(timer.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#FF4444" })]),
    );
  });

  it("should show orange color when time is medium low", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} timeRemaining={600} />,
    );

    const timer = getByTestId("cbt-header-timer");
    expect(timer.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#FF8800" })]),
    );
  });

  it("should show normal blue color when time is sufficient", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} timeRemaining={1200} />,
    );

    const timer = getByTestId("cbt-header-timer");
    expect(timer.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#0066CC" })]),
    );
  });

  it("should call onBackPress when back button is pressed", () => {
    const { getByTestId } = render(<CBTHeader {...mockProps} />);

    fireEvent.press(getByTestId("cbt-header-back-button"));
    expect(mockProps.onBackPress).toHaveBeenCalledTimes(1);
  });

  it("should call onMarkToggle when mark button is pressed", () => {
    const { getByTestId } = render(<CBTHeader {...mockProps} />);

    fireEvent.press(getByTestId("cbt-header-mark-button"));
    expect(mockProps.onMarkToggle).toHaveBeenCalledTimes(1);
  });

  it("should show bookmark icon when marked", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} isMarked={true} />,
    );

    const markButton = getByTestId("cbt-header-mark-button");
    expect(markButton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: "#E3F2FD" }),
      ]),
    );
  });

  it("should call onTimeUp when time reaches zero", () => {
    const { rerender } = render(<CBTHeader {...mockProps} timeRemaining={1} />);

    rerender(<CBTHeader {...mockProps} timeRemaining={0} />);

    expect(mockProps.onTimeUp).toHaveBeenCalledTimes(1);
  });

  it("should handle edge case of zero time remaining", () => {
    const { getByTestId } = render(
      <CBTHeader {...mockProps} timeRemaining={0} />,
    );

    expect(getByTestId("cbt-header-timer")).toHaveTextContent("00:00");
  });

  it("should render without onTimeUp callback", () => {
    const propsWithoutTimeUp = {
      ...mockProps,
      onTimeUp: undefined,
    };

    expect(() => {
      render(<CBTHeader {...propsWithoutTimeUp} />);
    }).not.toThrow();
  });
});
