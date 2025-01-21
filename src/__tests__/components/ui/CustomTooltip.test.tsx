import { render, screen, fireEvent } from "@testing-library/react";

import CustomTooltip from "@/src/components/ui/CustomTooltip";

describe("CustomTooltip", () => {
  const testContent = "Test tooltip content";
  const testChild = "Hover me";

  const setup = () => {
    return render(
      <CustomTooltip content={testContent}>
        <span>{testChild}</span>
      </CustomTooltip>,
    );
  };

  it("renders children correctly", () => {
    setup();
    expect(screen.getByText(testChild)).toBeInTheDocument();
  });

  it("renders tooltip content initially hidden", () => {
    setup();
    const tooltip = screen.getByText(testContent);

    expect(tooltip).toHaveClass("opacity-0");
  });

  it("shows tooltip on mouse enter", () => {
    setup();
    const container = screen.getByText(testChild).parentElement;

    fireEvent.mouseEnter(container!);

    const tooltip = screen.getByText(testContent);

    expect(tooltip).toHaveClass("opacity-100");
  });

  it("hides tooltip on mouse leave", () => {
    setup();
    const container = screen.getByText(testChild).parentElement;

    // Show tooltip
    fireEvent.mouseEnter(container!);
    // Hide tooltip
    fireEvent.mouseLeave(container!);

    const tooltip = screen.getByText(testContent);

    expect(tooltip).toHaveClass("opacity-0");
  });

  it("handles undefined content gracefully", () => {
    render(
      <CustomTooltip content={undefined}>
        <span>{testChild}</span>
      </CustomTooltip>,
    );

    expect(screen.getByText(testChild)).toBeInTheDocument();
  });

  it("handles number content", () => {
    const numberContent = 42;

    render(
      <CustomTooltip content={numberContent}>
        <span>{testChild}</span>
      </CustomTooltip>,
    );

    expect(screen.getByText(numberContent.toString())).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    setup();
    const tooltip = screen.getByText(testContent);

    expect(tooltip).toHaveClass(
      "absolute",
      "bottom-full",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "-mb-2",
      "z-10",
      "py-0.5",
      "px-3",
      "bg-blue-500",
      "text-white",
      "dark:text-black",
      "text-sm",
      "rounded-full",
      "shadow-lg",
      "text-nowrap",
      "transition-opacity",
      "duration-500",
      "ease-in-out",
    );
  });
});
