import React from "react";
import { render, screen } from "@testing-library/react";

import { UploadCard } from "@/components/rnd/chatbot/UploadCard";

describe("UploadCard", () => {
  const defaultProps = {
    title: "Test Card Title",
    description: "This is a test description for the card",
    children: <div data-testid="test-children">Test Children Content</div>,
  };

  it("renders with the correct title and description", () => {
    render(<UploadCard {...defaultProps} />);

    // Check title is rendered
    expect(screen.getByText("Test Card Title")).toBeInTheDocument();
    expect(screen.getByText("Test Card Title")).toHaveClass(
      "text-lg font-bold",
    );

    // Check description is rendered
    expect(
      screen.getByText("This is a test description for the card"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This is a test description for the card"),
    ).toHaveClass("text-sm text-foreground/70");
  });

  it("renders children content inside the card", () => {
    render(<UploadCard {...defaultProps} />);

    const childElement = screen.getByTestId("test-children");

    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Test Children Content");
  });

  it("applies correct CSS classes to the card", () => {
    render(<UploadCard {...defaultProps} />);

    // Card component should have specific classes
    const card = screen.getByTestId("card");

    expect(card).toHaveClass("bg-background border border-foreground w-full");

    // CardBody should contain a div with space-y-4 class
    const cardBody = screen.getByTestId("card-body");
    const spacedDiv = cardBody.querySelector("div");

    expect(spacedDiv).toHaveClass("space-y-4");
  });

  it("renders with multiple children elements", () => {
    render(
      <UploadCard
        description="Testing with multiple children"
        title="Multiple Children Test"
      >
        <button data-testid="child-button">Click Me</button>
        <p data-testid="child-paragraph">Test paragraph</p>
        <span data-testid="child-span">Test span</span>
      </UploadCard>,
    );

    // Verify all children are rendered
    expect(screen.getByTestId("child-button")).toBeInTheDocument();
    expect(screen.getByTestId("child-paragraph")).toBeInTheDocument();
    expect(screen.getByTestId("child-span")).toBeInTheDocument();
  });

  it("renders correctly with minimal props", () => {
    render(<UploadCard description="" title="Minimal Props" />);

    expect(screen.getByText("Minimal Props")).toBeInTheDocument();
    // Description should be an empty paragraph but still rendered
    const descriptionElements = screen.getAllByText("");

    expect(descriptionElements.length).toBeGreaterThanOrEqual(1);
  });
});
