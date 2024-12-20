import { render, screen, act } from "@testing-library/react";
import { createContext } from "react";

import LottieAnimation from "@/src/components/ui/LottieAnimation";

// Create a mock NonceContext
const NonceContext = createContext<string | undefined>(undefined);

jest.useFakeTimers(); // Add this at the top level

describe("LottieAnimation", () => {
  const mockSrc = "test-animation.lottie";
  const mockNonce = "test-nonce";

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    render(
      <NonceContext.Provider value={mockNonce}>
        <LottieAnimation src={mockSrc} />
      </NonceContext.Provider>,
    );

    // Wait for initial state
    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    const loadingSpinner = screen.getByTestId("loading-spinner");

    expect(loadingSpinner).toBeInTheDocument();
  });

  it("renders lottie animation after loading", async () => {
    render(
      <NonceContext.Provider value={mockNonce}>
        <LottieAnimation src={mockSrc} />
      </NonceContext.Provider>,
    );

    // Wait for loading to complete
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    const lottieAnimation = screen.getByTestId("lottie-animation");

    expect(lottieAnimation).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("applies custom className and style", async () => {
    const customClass = "test-class";
    const customStyle = { width: "100px" };

    render(
      <NonceContext.Provider value={mockNonce}>
        <LottieAnimation
          className={customClass}
          src={mockSrc}
          style={customStyle}
        />
      </NonceContext.Provider>,
    );

    // Wait for loading to complete
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    const animation = screen.getByTestId("lottie-animation");

    expect(animation).toHaveClass(customClass);
    expect(animation).toHaveStyle(customStyle);
  });

  it("shows loading content on error", async () => {
    jest.useFakeTimers();

    render(
      <NonceContext.Provider value={mockNonce}>
        <LottieAnimation src="invalid-src" />
      </NonceContext.Provider>,
    );

    // First render will trigger the error in useEffect
    await act(async () => {
      // Need to advance timers for both the error handling and loading state
      jest.advanceTimersByTime(0);
    });

    // Let React process the state updates
    await act(async () => {
      jest.runAllTimers();
    });

    // Now the loading spinner should be visible
    const loadingSpinner = screen.getByTestId("loading-spinner");

    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.queryByTestId("lottie-animation")).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(
      "Lottie Animation Error:",
      expect.any(Error),
    );

    jest.useRealTimers();
  }, 10000); // Increase timeout to 10s
});

afterAll(() => {
  jest.useRealTimers();
});
