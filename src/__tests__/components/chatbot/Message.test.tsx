import { render, screen } from "@testing-library/react";

import Message from "@/components/chatbot/Message";
import { MessageProps } from "@/interfaces/chatbot";

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
      "bg-sky-500",
      "text-sky-950",
      "rounded-br-none",
    );
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
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
      "bg-amber-500",
      "text-amber-950",
      "rounded-bl-none",
    );
    expect(screen.getByText("How can I help?")).toBeInTheDocument();
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
      "bg-amber-500",
      "text-amber-950",
      "rounded-bl-none",
    );
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
      "bg-amber-500",
      "text-amber-950",
      "rounded-bl-none",
    );
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
});
