import { render, screen } from "@testing-library/react";

import Message from "@/components/chatbot/Message";
import { MessageProps } from "@/interfaces/chatbot";

// Mock ReactMarkdown component
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown">{children}</div>;
  };
});

// Mock marked library - fix the structure to match how it's imported
jest.mock("marked", () => {
  // Update the mock lexer to split content by newlines and return multiple blocks
  const mockLexer = jest.fn((content: string) =>
    content.split("\n").map((line) => ({ raw: line })),
  );

  // Export the correct structure
  return {
    marked: {
      lexer: mockLexer,
    },
  };
});

describe("Message Component", () => {
  const createMessage = (
    role: MessageProps["message"]["role"],
    content: string,
  ) => ({
    id: "test-id",
    role,
    content,
  });

  it("renders user message with correct styling", () => {
    const message = createMessage("user", "Hello there!");
    const { container } = render(<Message message={message} />);

    const messageContainer = container.firstChild as HTMLElement;
    const messageContent = messageContainer.querySelector(
      "div:last-child",
    ) as HTMLElement;

    expect(messageContainer).toHaveClass("justify-end", "ml-auto");
    expect(messageContent).toHaveClass(
      "border",
      "border-sky-500",
      "text-sky-500",
      "rounded-br-none",
    );
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
    expect(screen.queryByTestId("markdown")).not.toBeInTheDocument();
  });

  it("renders assistant message with correct styling", () => {
    const message = createMessage("assistant", "How can I help?");
    const { container } = render(<Message message={message} />);

    const messageContainer = container.firstChild as HTMLElement;
    const messageContent = messageContainer.querySelector(
      "div:last-child",
    ) as HTMLElement;

    expect(messageContainer).toHaveClass("justify-start", "mr-auto");
    expect(messageContent).toHaveClass(
      "bg-sky-500",
      "text-sky-950",
      "rounded-bl-none",
    );
    // Now there will be one markdown element per block (line in this mock)
    expect(screen.getAllByTestId("markdown").length).toBeGreaterThan(0);
    // Check the text content of the parent containing the markdown blocks
    expect(messageContent).toHaveTextContent("How can I help?");
  });

  it("renders system message with same styling as non-user messages", () => {
    const message = createMessage("system", "System notification");
    const { container } = render(<Message message={message} />);

    const messageContainer = container.firstChild as HTMLElement;
    const messageContent = messageContainer.querySelector(
      "div:last-child",
    ) as HTMLElement;

    expect(messageContainer).toHaveClass("justify-start", "mr-auto");
    expect(messageContent).toHaveClass(
      "bg-sky-500",
      "text-sky-950",
      "rounded-bl-none",
    );
    expect(screen.getAllByTestId("markdown").length).toBeGreaterThan(0);
    // Check the text content of the parent containing the markdown blocks
    expect(messageContent).toHaveTextContent("System notification");
  });

  it("renders data message with same styling as non-user messages", () => {
    const message = createMessage("data", "Data content");
    const { container } = render(<Message message={message} />);

    const messageContainer = container.firstChild as HTMLElement;
    const messageContent = messageContainer.querySelector(
      "div:last-child",
    ) as HTMLElement;

    expect(messageContainer).toHaveClass("justify-start", "mr-auto");
    expect(messageContent).toHaveClass(
      "bg-sky-500",
      "text-sky-950",
      "rounded-bl-none",
    );
    expect(screen.getAllByTestId("markdown").length).toBeGreaterThan(0);
    // Check the text content of the parent containing the markdown blocks
    expect(messageContent).toHaveTextContent("Data content");
  });

  it("applies common styling to all messages", () => {
    const message = createMessage("user", "Test message");
    const { container } = render(<Message message={message} />);

    const messageContainer = container.firstChild as HTMLElement;
    const messageContent = messageContainer.querySelector(
      "div:last-child",
    ) as HTMLElement;

    expect(messageContainer).toHaveClass(
      "group",
      "flex",
      "mb-2",
      "max-w-[75%]",
    );
    expect(messageContent).toHaveClass(
      "rounded-2xl",
      "px-4",
      "py-2",
      "break-words",
      "shadow-sm",
    );
  });

  it("handles long messages without breaking layout", () => {
    const longMessage = createMessage(
      "user",
      "This is a very long message that should test the break-words functionality and ensure the layout stays intact even with lengthy content that might potentially wrap to multiple lines",
    );
    const { container } = render(<Message message={longMessage} />);

    // Fix: use a more specific selector to get the inner message content div
    const messageContent = container.querySelector(
      '[class*="rounded-2xl"]',
    ) as HTMLElement;

    expect(messageContent?.className).toContain("break-words");
    expect(container.firstChild).toHaveClass("max-w-[75%]");
  });

  it("handles markdown content in non-user messages", () => {
    const markdownContent =
      "# Heading\n- List item\n- Another item\n```code block```";
    const message = createMessage("assistant", markdownContent);
    const { container } = render(<Message message={message} />);

    const messageContent = container.querySelector(
      '[class*="rounded-2xl"]', // Get the inner content div
    ) as HTMLElement;

    // Check that multiple markdown blocks were rendered (one per line based on the mock)
    expect(screen.getAllByTestId("markdown").length).toBe(
      markdownContent.split("\n").length,
    );
    // Check the combined text content of the parent div, preserving whitespace structure
    expect(messageContent).toHaveTextContent(
      "# Heading- List item- Another item```code block```",
    );
    // Note: toHaveTextContent normalizes whitespace by default.
    // If precise newline checking is needed, consider alternative assertions or snapshot testing.
  });
});
