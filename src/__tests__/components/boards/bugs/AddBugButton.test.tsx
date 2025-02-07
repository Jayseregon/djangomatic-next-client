import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddBugButton } from "@/components/boards/bugs/AddBugButton";

// Mock the TriggerButton to render a simple button for testing
jest.mock("@/components/rnd/TriggerButton", () => ({
  TriggerButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Open Modal</button>
  ),
}));

// Mock the BugsModal to control its behavior in tests
jest.mock("@/components/boards/bugs/BugsModal", () => ({
  BugsModal: ({
    visible,
    onSave,
    onClose,
  }: {
    visible: boolean;
    onSave: (bug: any) => void;
    onClose: () => void;
  }) =>
    visible && (
      <div data-testid="bugs-modal">
        <button onClick={() => onSave({ title: "Test Bug" })}>Save Bug</button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ),
}));

describe("AddBugButton", () => {
  const mockOnBugChange = jest.fn();
  const sessionUsername = "tester";
  const isAdminSide = false;

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders trigger button and does not show modal initially", () => {
    render(
      <AddBugButton
        isAdminSide={isAdminSide}
        sessionUsername={sessionUsername}
        onBugChange={mockOnBugChange}
      />,
    );
    expect(screen.getByText("Open Modal")).toBeInTheDocument();
    expect(screen.queryByTestId("bugs-modal")).not.toBeInTheDocument();
  });

  it("opens the modal on trigger button click", async () => {
    render(
      <AddBugButton
        isAdminSide={isAdminSide}
        sessionUsername={sessionUsername}
        onBugChange={mockOnBugChange}
      />,
    );
    userEvent.click(screen.getByText("Open Modal"));
    expect(await screen.findByTestId("bugs-modal")).toBeInTheDocument();
  });

  it("calls onBugChange after successful bug save", async () => {
    // mock fetch to return success
    jest.spyOn(window, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(
      <AddBugButton
        isAdminSide={isAdminSide}
        sessionUsername={sessionUsername}
        onBugChange={mockOnBugChange}
      />,
    );
    // open modal
    userEvent.click(screen.getByText("Open Modal"));
    expect(await screen.findByTestId("bugs-modal")).toBeInTheDocument();
    // click save in modal
    userEvent.click(screen.getByText("Save Bug"));
    // wait for onBugChange to be called and modal to close
    await waitFor(() => {
      expect(mockOnBugChange).toHaveBeenCalled();
      expect(screen.queryByTestId("bugs-modal")).not.toBeInTheDocument();
    });
  });
});
