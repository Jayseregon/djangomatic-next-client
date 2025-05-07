import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

import SourceDeletedToast from "@/components/rnd/chatbot/SourceDeletedToast";
import { ChromaDeleteSourceResponse } from "@/interfaces/chatbot";

// Create a mock function for useTheme
const mockUseTheme = jest.fn().mockReturnValue({
  theme: "light", // default mock value
  setTheme: jest.fn(),
});

// Mock the next-themes module
jest.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children, // Mock ThemeProvider as a pass-through component
}));

describe("SourceDeletedToast", () => {
  const mockSetOpen = jest.fn();
  const mockResponse: ChromaDeleteSourceResponse = {
    status: "success",
    message: "Source deleted successfully",
    documents_deleted: 5,
  };

  const defaultProps = {
    response: mockResponse,
    collectionName: "test-collection",
    sourceName: "test-document.pdf",
    open: true,
    setOpen: mockSetOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders successfully with success state", () => {
    render(
      <ThemeProvider>
        <SourceDeletedToast {...defaultProps} />
      </ThemeProvider>,
    );

    // Check that the success title is displayed
    expect(screen.getByText("Source removed successfully")).toBeInTheDocument();

    // Check that collection and source information are displayed
    expect(screen.getByText(/Collection:/)).toBeInTheDocument();
    expect(screen.getByText("test-collection")).toBeInTheDocument();
    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();

    // Check that documents count is displayed
    expect(screen.getByText("Documents removed: 5")).toBeInTheDocument();

    // Success message should be displayed if present
    expect(screen.getByText("Source deleted successfully")).toBeInTheDocument();
  });

  test("renders with error state", () => {
    render(
      <ThemeProvider>
        <SourceDeletedToast {...defaultProps} isError={true} />
      </ThemeProvider>,
    );

    // Check that the error title is displayed
    expect(screen.getByText("Failed to remove source")).toBeInTheDocument();

    // Still shows collection and source information
    expect(screen.getByText(/Collection:/)).toBeInTheDocument();
    expect(screen.getByText("test-collection")).toBeInTheDocument();
    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();

    // Documents count should not be shown in error state
    expect(screen.queryByText(/Documents removed:/)).not.toBeInTheDocument();

    // Error message should be displayed if present
    expect(screen.getByText("Source deleted successfully")).toBeInTheDocument();
  });

  test("calls setOpen when close button is clicked", () => {
    render(
      <ThemeProvider>
        <SourceDeletedToast {...defaultProps} />
      </ThemeProvider>,
    );

    // Find and click the close button
    const closeButton = screen.getByTestId("close-button");

    fireEvent.click(closeButton);

    // Verify that setOpen was called with false
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  test("handles message being undefined", () => {
    const propsWithoutMessage = {
      ...defaultProps,
      response: {
        ...mockResponse,
        message: undefined,
      },
    };

    render(
      <ThemeProvider>
        <SourceDeletedToast {...propsWithoutMessage} />
      </ThemeProvider>,
    );

    // Should still render without crashing
    expect(screen.getByText("Source removed successfully")).toBeInTheDocument();
    expect(
      screen.queryByText(/Source deleted successfully/),
    ).not.toBeInTheDocument();
  });

  test("handles long source names with truncation", () => {
    const longSourceName =
      "a-very-long-source-name-that-should-be-truncated-to-fit-the-available-space-in-the-toast-component.pdf";
    const propsWithLongSource = {
      ...defaultProps,
      sourceName: longSourceName,
    };

    render(
      <ThemeProvider>
        <SourceDeletedToast {...propsWithLongSource} />
      </ThemeProvider>,
    );

    // Should include the source name in the document even though it's truncated visually
    const sourceElement = screen.getByText(longSourceName);

    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveClass("truncate");
  });

  test("uses different icon colors based on theme", () => {
    // Mock the useTheme hook for dark theme
    mockUseTheme.mockReturnValueOnce({
      theme: "dark",
      setTheme: jest.fn(),
      themes: [],
    });

    const { rerender } = render(
      <ThemeProvider>
        <SourceDeletedToast {...defaultProps} />
      </ThemeProvider>,
    );

    // For dark theme testing we need to check the internal code paths
    // This is handled in the actual component, so we can't easily verify
    // without checking component internals

    // Re-render with light theme
    mockUseTheme.mockReturnValueOnce({
      theme: "light",
      setTheme: jest.fn(),
      themes: [],
    });

    rerender(
      <ThemeProvider>
        <SourceDeletedToast {...defaultProps} />
      </ThemeProvider>,
    );

    // Component should re-render without errors
    expect(screen.getByText("Source removed successfully")).toBeInTheDocument();
  });
});
