import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LocaleSwitcher from "@/src/components/ui/LocaleSwitcher";
import { setUserLocale } from "@/lib/locale";

// Mock next-intl
jest.mock("next-intl", () => ({
  useLocale: jest.fn().mockReturnValue("en"),
  useTranslations: () => (key: string, params?: { locale: string }) => {
    if (key === "localeFlag") {
      return params?.locale === "en" ? "🇬🇧" : "🇫🇷";
    }

    return key;
  },
}));

// Mock setUserLocale
jest.mock("@/lib/locale", () => ({
  setUserLocale: jest.fn(),
}));

describe("LocaleSwitcher", () => {
  // Setup localStorage mock
  const mockSetItem = jest.fn();
  const mockGetItem = jest.fn();

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    });

    // Mock document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("renders with correct initial locale flag", () => {
    render(<LocaleSwitcher />);
    expect(screen.getByLabelText("label")).toBeInTheDocument();
    expect(screen.getByText("🇬🇧")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const testClass = "test-class";

    render(<LocaleSwitcher className={testClass} />);
    expect(screen.getByRole("button")).toHaveClass(testClass);
  });

  it("applies nonce attribute when provided", () => {
    const testNonce = "test-nonce-123";

    render(<LocaleSwitcher nonce={testNonce} />);
    expect(screen.getByRole("button")).toHaveAttribute("nonce", testNonce);
  });

  it("toggles locale on button click", async () => {
    const user = userEvent.setup();

    render(<LocaleSwitcher />);

    const button = screen.getByRole("button");

    await user.click(button);

    expect(mockSetItem).toHaveBeenCalledWith("preferredLocale", "fr");
    expect(setUserLocale).toHaveBeenCalledWith("fr");
    expect(document.cookie).toContain("NEXT_LOCALE=fr");
  });

  it("cycles through available locales", async () => {
    const { useLocale } = require("next-intl");
    const user = userEvent.setup();

    // Start with English
    useLocale.mockReturnValue("en");
    const { rerender } = render(<LocaleSwitcher />);

    // Click to switch to French
    await user.click(screen.getByRole("button"));
    useLocale.mockReturnValue("fr");
    rerender(<LocaleSwitcher />);

    // Verify French state
    expect(mockSetItem).toHaveBeenLastCalledWith("preferredLocale", "fr");

    // Click to switch back to English
    await user.click(screen.getByRole("button"));
    expect(mockSetItem).toHaveBeenLastCalledWith("preferredLocale", "en");
  });
});
