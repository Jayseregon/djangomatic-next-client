import { render, screen, fireEvent, act } from "@testing-library/react";
import { useChat } from "@ai-sdk/react";

import Chat from "@/src/app/chatbot/page";

// Mock the useChat hook
jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

describe("Chat Component", () => {
  const mockHandleSubmit = jest.fn((e) => e.preventDefault());
  const mockHandleInputChange = jest.fn();
  const mockScrollIntoView = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    // Setup useChat mock implementation
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
    });
  });

  it("renders the chat interface", () => {
    render(<Chat />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("How can I help you today?"),
    ).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<Chat />);

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "Hello" } });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("handles form submission", () => {
    render(<Chat />);

    const form = screen.getByRole("searchbox").closest("form");

    fireEvent.submit(form!);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("displays messages correctly", () => {
    const mockMessages = [
      { id: "1", role: "user", content: "Hello" },
      { id: "2", role: "assistant", content: "Hi there!" },
    ];

    (useChat as jest.Mock).mockReturnValue({
      messages: mockMessages,
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
    });

    render(<Chat />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("scrolls to bottom when new messages arrive", async () => {
    const mockMessages = [{ id: "1", role: "user", content: "Hello" }];

    (useChat as jest.Mock).mockReturnValue({
      messages: mockMessages,
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
    });

    render(<Chat />);

    // Wait for useEffect to run
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("maintains fixed layout structure", () => {
    render(<Chat />);

    const mainContainer = screen.getByRole("searchbox").closest("div.fixed");

    expect(mainContainer).toHaveClass("fixed inset-x-0");

    const inputContainer = screen
      .getByRole("searchbox")
      .closest("div.flex-none");

    expect(inputContainer).toHaveClass("bg-background/80");
  });
});
