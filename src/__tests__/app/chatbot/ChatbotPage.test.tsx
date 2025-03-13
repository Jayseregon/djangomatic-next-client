import { render, screen, fireEvent, act } from "@testing-library/react";
import { useChat } from "@ai-sdk/react";
import { useSession } from "next-auth/react";

import ChatbotPage from "@/src/app/chatbot/page";

// Mock the required hooks and components
jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock the components used in ChatbotPage
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/chatbot/UserAccess", () => ({
  UserAccessChatbot: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-access">{children}</div>
  ),
}));

jest.mock("@/src/components/error/ErrorBoundary", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

describe("ChatbotPage Component", () => {
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

    // Setup useSession mock with authenticated user
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
        },
      },
      status: "authenticated",
    });
  });

  it("renders unauthenticated view when no session", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<ChatbotPage />);
    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
  });

  it("renders unauthenticated view when no email in session", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: {} },
      status: "authenticated",
    });

    render(<ChatbotPage />);
    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
  });

  it("renders the chat interface when authenticated", () => {
    render(<ChatbotPage />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("How can I help you today?"),
    ).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<ChatbotPage />);

    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "Hello" } });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("handles form submission", () => {
    render(<ChatbotPage />);

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

    render(<ChatbotPage />);

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

    render(<ChatbotPage />);

    // Wait for useEffect to run
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("maintains fixed layout structure", () => {
    render(<ChatbotPage />);

    const mainContainer = screen.getByRole("searchbox").closest("div.fixed");

    expect(mainContainer).toHaveClass("fixed inset-x-0");

    const inputContainer = screen
      .getByRole("searchbox")
      .closest("div.flex-none");

    expect(inputContainer).toHaveClass("bg-background/80");
  });

  it("renders with error boundary", () => {
    render(<ChatbotPage />);
    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
  });

  it("renders with user access wrapper", () => {
    render(<ChatbotPage />);
    expect(screen.getByTestId("user-access")).toBeInTheDocument();
  });
});
