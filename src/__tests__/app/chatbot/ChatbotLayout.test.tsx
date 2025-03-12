import { render, screen } from "@testing-library/react";

import ChatbotLayout from "@/src/app/chatbot/layout";

describe("ChatbotLayout", () => {
  it("renders children within the layout", () => {
    render(
      <ChatbotLayout>
        <div data-testid="test-child">Test Content</div>
      </ChatbotLayout>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("maintains proper layout structure", () => {
    render(
      <ChatbotLayout>
        <div>Content</div>
      </ChatbotLayout>,
    );

    const section = screen.getByRole("region", { name: /chat interface/i });

    expect(section).toHaveClass("flex", "flex-col", "items-center", "w-full");
  });

  it("centers content horizontally", () => {
    render(
      <ChatbotLayout>
        <div>Centered Content</div>
      </ChatbotLayout>,
    );

    const section = screen.getByRole("region", { name: /chat interface/i });

    expect(section).toHaveClass("items-center");
  });

  it("takes full width", () => {
    render(
      <ChatbotLayout>
        <div>Full Width Content</div>
      </ChatbotLayout>,
    );

    const section = screen.getByRole("region", { name: /chat interface/i });

    expect(section).toHaveClass("w-full");
  });
});
