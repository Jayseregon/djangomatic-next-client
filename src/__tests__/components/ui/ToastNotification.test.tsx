import type { ToastResponse } from "@/src/components/ui/ToastNotification";

import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Fix the import path - make sure it matches your project structure
import ToastNotification from "@/src/components/ui/ToastNotification";

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

const mockResponse: ToastResponse = {
  message: "Test message",
  id: "test-id-123",
  updatedAt: new Date("2024-01-01T12:00:00Z"),
};

describe("ToastNotification", () => {
  const defaultProps = {
    response: mockResponse,
    open: true,
    setOpen: jest.fn(),
  };

  it("renders correctly when open", () => {
    render(
      <ThemeProvider>
        <ToastNotification {...defaultProps} />
      </ThemeProvider>,
    );

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText(/report id: test-id-123/i)).toBeInTheDocument();
    expect(screen.getByText(/updated at:/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <ThemeProvider>
        <ToastNotification {...defaultProps} open={false} />
      </ThemeProvider>,
    );

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("displays formatted date correctly", () => {
    render(
      <ThemeProvider>
        <ToastNotification {...defaultProps} />
      </ThemeProvider>,
    );

    const expectedDate = new Date("2024-01-01T12:00:00Z").toLocaleString();

    expect(screen.getByText(`updated at: ${expectedDate}`)).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(
      <ThemeProvider>
        <ToastNotification {...defaultProps} />
      </ThemeProvider>,
    );

    const closeButton = screen.getByRole("button", {
      name: /close notification/i,
    });

    expect(closeButton).toBeInTheDocument();
  });
});
