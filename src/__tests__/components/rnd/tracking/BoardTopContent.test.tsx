import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { BoardTopContent } from "@/src/components/rnd/tracking/BoardTopContent";

// Mock the lucide-react icons
jest.mock("lucide-react", () => ({
  RefreshCcw: () => <div data-testid="refresh-icon">RefreshIcon</div>,
}));

describe("BoardTopContent", () => {
  it("renders the refresh button", () => {
    const mockReload = jest.fn();

    render(<BoardTopContent reload={mockReload} />);

    // Check if the refresh icon is rendered
    const refreshIcon = screen.getByTestId("refresh-icon");

    expect(refreshIcon).toBeInTheDocument();
  });

  it("calls the reload function when refresh button is clicked", () => {
    const mockReload = jest.fn();

    render(<BoardTopContent reload={mockReload} />);

    // Find and click the button
    const refreshButton = screen.getByRole("button");

    fireEvent.click(refreshButton);

    // Verify the reload function was called
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("displays the selected year when provided", () => {
    const mockReload = jest.fn();
    const testYear = 2023;

    render(<BoardTopContent reload={mockReload} selectedYear={testYear} />);

    // Check if the year information is displayed
    const yearText = screen.getByText(`Showing data for ${testYear}`);

    expect(yearText).toBeInTheDocument();
  });

  it("does not display the year information when selectedYear is not provided", () => {
    const mockReload = jest.fn();

    render(<BoardTopContent reload={mockReload} />);

    // Check that no year information is displayed
    const yearText = screen.queryByText(/Showing data for/);

    expect(yearText).not.toBeInTheDocument();
  });

  it("applies the correct styling to the container", () => {
    const mockReload = jest.fn();
    const { container } = render(<BoardTopContent reload={mockReload} />);

    // Check if the main container has the expected styling classes
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("justify-between");
    expect(mainDiv).toHaveClass("items-center");
  });

  it("renders the button with the correct properties", () => {
    const mockReload = jest.fn();

    render(<BoardTopContent reload={mockReload} />);

    // Find the button
    const button = screen.getByRole("button");

    // Check button properties using data attributes from our mock
    expect(button).toHaveAttribute("data-color", "primary");
    expect(button).toHaveAttribute("data-icon-only", "true");
  });
});
