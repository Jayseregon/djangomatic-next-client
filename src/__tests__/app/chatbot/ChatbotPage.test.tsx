import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { useChat } from "@ai-sdk/react";
import { useSession } from "next-auth/react";

// Mock react-markdown to avoid ESM import issues
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown">{children}</div>;
  };
});

// Mock marked library
jest.mock("marked", () => {
  const mockLexer = jest.fn((content: string) =>
    content.split("\n").map((line) => ({ raw: line })),
  );

  return {
    marked: {
      lexer: mockLexer,
    },
  };
});

import ChatbotPage from "@/src/app/chatbot/page";
import * as trackingActions from "@/actions/chatbot/tracking/action";

// Mock the required hooks and components
jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock server actions
jest.mock("@/actions/chatbot/tracking/action", () => ({
  initiateChatInteraction: jest.fn(),
  finalizeChatInteraction: jest.fn(),
  incrementReloadCount: jest.fn(),
  incrementStopCount: jest.fn(),
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
  const mockOriginalUseChatHandleSubmit = jest.fn((e) => e.preventDefault());
  const mockHandleInputChange = jest.fn();
  const mockScrollIntoView = jest.fn();
  const mockOriginalReload = jest.fn();
  const mockOriginalStop = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Silence console.log
    jest.spyOn(console, "error").mockImplementation(() => {}); // Silence console.error
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original console methods
  });

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
      handleSubmit: mockOriginalUseChatHandleSubmit, // This is the original handleSubmit from useChat
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
    });

    // Setup useSession mock with authenticated user
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          name: "Test User", // Add name as it's used in page.tsx
        },
      },
      status: "authenticated",
    });

    // Mock server action return values
    (trackingActions.initiateChatInteraction as jest.Mock).mockResolvedValue({
      logId: "test-log-id",
    });
    (trackingActions.finalizeChatInteraction as jest.Mock).mockResolvedValue(
      {},
    );
    (trackingActions.incrementReloadCount as jest.Mock).mockResolvedValue({});
    (trackingActions.incrementStopCount as jest.Mock).mockResolvedValue({});
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

  it("handles form submission", async () => {
    // Set input value for the useChat mock
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: "Test message", // Add non-empty input value
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
    });

    render(<ChatbotPage />);

    const form = screen.getByRole("searchbox").closest("form");

    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockOriginalUseChatHandleSubmit).toHaveBeenCalled();
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
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
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
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
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

  it("handles form submission, initiates interaction, and calls original useChat handleSubmit", async () => {
    // Set input value for the useChat mock
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: "Hello there", // Simulate user typing
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
    });

    render(<ChatbotPage />);

    const inputField = screen.getByRole("searchbox");
    // Simulate user typing for the component's internal input state if necessary,
    // but here we rely on the `input` from `useChat` mock for `userMessageContentLength`.
    // fireEvent.change(inputField, { target: { value: "Hello there" } }); // This would call mockHandleInputChange

    const form = inputField.closest("form");

    expect(form).toBeInTheDocument();

    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(trackingActions.initiateChatInteraction).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      {
        chatId: "test-chat-session-id",
        userMessageLength: "Hello there".length, // Based on mocked input
        status: "submitted",
      },
    );
    expect(mockOriginalUseChatHandleSubmit).toHaveBeenCalled();
  });

  it("does not submit if input is empty", async () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: "  ", // Simulate empty/whitespace input
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
    });
    render(<ChatbotPage />);
    const form = screen.getByRole("searchbox").closest("form");

    await act(async () => {
      fireEvent.submit(form!);
    });
    expect(trackingActions.initiateChatInteraction).not.toHaveBeenCalled();
    expect(mockOriginalUseChatHandleSubmit).not.toHaveBeenCalled();
  });

  it("conditionally renders Stop button when status is streaming", () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [{ id: "1", role: "user", content: "Hello" }],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "streaming", // Set status to streaming
    });
    render(<ChatbotPage />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });

  it("handles Stop button click", async () => {
    // Setup mock with a stable implementation for the entire test
    (useChat as jest.Mock).mockImplementation(() => ({
      messages: [{ id: "1", role: "user", content: "Test message" }],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "streaming", // Always streaming to show stop button
    }));

    // Setup the logged ID that will be returned
    const mockLogId = "active-log-id";

    (trackingActions.initiateChatInteraction as jest.Mock).mockResolvedValue({
      logId: mockLogId,
    });

    // Setup a simulated log ID state by capturing the onSubmit callback
    let capturedSubmitHandler:
      | ((e: React.FormEvent<HTMLFormElement>) => void)
      | null = null;

    const originalSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Simulate the component's behavior of storing the log ID
      if (capturedSubmitHandler) capturedSubmitHandler(e);
    });

    (useChat as jest.Mock).mockImplementation(({ onSubmit }) => {
      capturedSubmitHandler = onSubmit;

      return {
        messages: [{ id: "1", role: "user", content: "Test message" }],
        input: "Test message",
        handleInputChange: mockHandleInputChange,
        handleSubmit: originalSubmit,
        reload: mockOriginalReload,
        stop: mockOriginalStop,
        error: null,
        id: "test-chat-session-id",
        status: "streaming",
      };
    });

    render(<ChatbotPage />);

    // Simulate form submission to set internal log ID
    const form = screen.getByRole("searchbox").closest("form");

    await act(async () => {
      fireEvent.submit(form!);
      // Wait for promises to resolve
      await Promise.resolve();
    });

    // Click the stop button
    const stopButton = screen.getByRole("button", { name: /stop/i });

    await act(async () => {
      fireEvent.click(stopButton);
      // Wait for promises to resolve
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify our expectations
    expect(trackingActions.incrementStopCount).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(trackingActions.finalizeChatInteraction).toHaveBeenCalledWith(
      mockLogId,
      expect.objectContaining({
        status: "stopped",
        errorDetails: "User stopped generation",
      }),
    );
    expect(mockOriginalStop).toHaveBeenCalled();
  });

  it("conditionally renders Reload button when status is ready and messages exist", () => {
    (useChat as jest.Mock).mockReturnValue({
      messages: [{ id: "1", role: "user", content: "Hello" }],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready", // Set status to ready
    });
    render(<ChatbotPage />);
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });

  it("handles Reload button click", async () => {
    const mockMessages = [
      { id: "1", role: "user", content: "Previous message" },
    ];

    (useChat as jest.Mock).mockReturnValue({
      messages: mockMessages,
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockOriginalUseChatHandleSubmit,
      reload: mockOriginalReload,
      stop: mockOriginalStop,
      error: null,
      id: "test-chat-session-id",
      status: "ready",
    });

    render(<ChatbotPage />);
    const reloadButton = screen.getByRole("button", { name: /reload/i });

    await act(async () => {
      fireEvent.click(reloadButton);
    });

    expect(trackingActions.incrementReloadCount).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(trackingActions.initiateChatInteraction).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      {
        chatId: "test-chat-session-id",
        userMessageLength: mockMessages[0].content.length,
        status: "submitted",
      },
    );
    expect(mockOriginalReload).toHaveBeenCalled();
  });

  // Test onFinish and onError handlers
  it("calls finalizeChatInteraction onFinish when message content is present", async () => {
    const mockLogId = "finish-log-id";

    (trackingActions.initiateChatInteraction as jest.Mock).mockResolvedValue({
      logId: mockLogId,
    });

    const onFinishRef = {
      current: null as
        | ((
            message: { role: string; content: string },
            options: {
              usage: {
                promptTokens: number;
                completionTokens: number;
                totalTokens: number;
              };
            },
          ) => Promise<void>)
        | null,
    };

    (useChat as jest.Mock).mockImplementation(({ onFinish }) => {
      onFinishRef.current = onFinish; // Capture the onFinish handler

      return {
        messages: [],
        input: "Test for onFinish",
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockOriginalUseChatHandleSubmit,
        reload: mockOriginalReload,
        stop: mockOriginalStop,
        error: null,
        id: "test-chat-session-id",
        status: "ready",
      };
    });

    render(<ChatbotPage />);

    // Simulate submit to initiate interaction
    const form = screen.getByRole("searchbox").closest("form");

    await act(async () => {
      fireEvent.submit(form!);
    });

    // Ensure initiateChatInteraction was called and logId is set
    await waitFor(() =>
      expect(trackingActions.initiateChatInteraction).toHaveBeenCalled(),
    );

    // Simulate onFinish call from useChat
    const mockMessage = { role: "assistant", content: "Final response" };
    const mockUsage = {
      promptTokens: 10,
      completionTokens: 20,
      totalTokens: 30,
    };

    if (onFinishRef.current) {
      await act(async () => {
        // @ts-expect-error onFinish expects specific parameters from useChat
        await onFinishRef.current(mockMessage, { usage: mockUsage });
      });
    }

    expect(trackingActions.finalizeChatInteraction).toHaveBeenCalledWith(
      mockLogId,
      expect.objectContaining({
        status: "ready",
        assistantMessageLength: mockMessage.content.length,
        promptTokens: mockUsage.promptTokens,
      }),
    );
  });

  it("calls finalizeChatInteraction onError", async () => {
    const mockLogId = "error-log-id";

    (trackingActions.initiateChatInteraction as jest.Mock).mockResolvedValue({
      logId: mockLogId,
    });

    const onErrorRef = {
      current: null as ((error: Error) => Promise<void>) | null,
    };

    (useChat as jest.Mock).mockImplementation(({ onError }) => {
      onErrorRef.current = onError; // Capture the onError handler

      return {
        messages: [],
        input: "Test for onError",
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockOriginalUseChatHandleSubmit,
        reload: mockOriginalReload,
        stop: mockOriginalStop,
        error: null,
        id: "test-chat-session-id",
        status: "ready",
      };
    });

    render(<ChatbotPage />);

    // Simulate submit
    const form = screen.getByRole("searchbox").closest("form");

    await act(async () => {
      fireEvent.submit(form!);
    });
    await waitFor(() =>
      expect(trackingActions.initiateChatInteraction).toHaveBeenCalled(),
    );

    // Simulate onError call
    const mockError = new Error("Test chat error");

    if (onErrorRef.current) {
      await act(async () => {
        // @ts-expect-error onError expects an Error object from useChat
        await onErrorRef.current(mockError);
      });
    }

    expect(trackingActions.finalizeChatInteraction).toHaveBeenCalledWith(
      mockLogId,
      expect.objectContaining({
        status: "error",
        errorDetails: mockError.message,
      }),
    );
  });
});
