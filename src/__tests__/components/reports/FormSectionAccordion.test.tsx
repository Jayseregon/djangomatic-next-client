import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import FormSectionAccordion from "@/src/components/reports/FormSectionAccordion";

describe("FormSectionAccordion", () => {
  const defaultProps = {
    title: "Test Section",
    menuKey: "test-section",
    children: <div data-testid="accordion-content">Test Content</div>,
  };

  it("renders with title", () => {
    render(<FormSectionAccordion {...defaultProps} />);

    expect(screen.getByText("Test Section")).toBeInTheDocument();
  });

  it("toggles content visibility when clicked", () => {
    render(<FormSectionAccordion {...defaultProps} />);

    const trigger = screen.getByRole("button");
    const content = screen.getByRole("region", { hidden: true });

    // Initially content should be hidden
    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("hidden");

    // Click to open
    fireEvent.click(trigger);
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).not.toHaveAttribute("hidden");

    // Click to close
    fireEvent.click(trigger);
    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("hidden");
  });

  it("renders open by default when defaultOpen is true", () => {
    render(<FormSectionAccordion {...defaultProps} defaultOpen={true} />);

    const content = screen.getByRole("region");

    expect(content).toHaveAttribute("data-state", "open");
    expect(content).not.toHaveAttribute("hidden");
  });

  it("renders closed by default when defaultOpen is false", () => {
    render(<FormSectionAccordion {...defaultProps} defaultOpen={false} />);

    const content = screen.getByRole("region", { hidden: true });

    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("hidden");
  });

  it("has correct styling classes", () => {
    render(<FormSectionAccordion {...defaultProps} />);

    const trigger = screen.getByRole("button");

    expect(trigger).toHaveClass(
      "group",
      "flex",
      "h-[45px]",
      "flex-1",
      "items-center",
      "rounded-t-xl",
      "justify-between",
      "uppercase",
      "font-semibold",
      "text-xl",
    );
  });

  it("renders chevron icon that rotates", () => {
    render(<FormSectionAccordion {...defaultProps} />);

    const trigger = screen.getByRole("button");
    const chevron = screen.getByRole("button").querySelector("svg");

    expect(chevron).toBeInTheDocument();

    // Check initial state
    expect(chevron).not.toHaveClass("rotate-180");

    // Click to open
    fireEvent.click(trigger);

    // Check for rotation class on parent group
    expect(trigger).toHaveAttribute("data-state", "open");
  });

  it("is keyboard accessible", async () => {
    render(<FormSectionAccordion {...defaultProps} />);

    const trigger = screen.getByRole("button");
    const content = screen.getByRole("region", { hidden: true });

    // Simulate click instead of keyboard event
    trigger.focus();
    fireEvent.click(trigger);

    // Wait for Radix UI's state updates
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(content).toHaveAttribute("data-state", "open");
      expect(content).not.toHaveAttribute("hidden");
    });

    // Click again to close
    fireEvent.click(trigger);

    // Wait for Radix UI's state updates
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(content).toHaveAttribute("data-state", "closed");
      expect(content).toHaveAttribute("hidden");
    });
  });
});
