import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Removed deprecated act import
import { BugsManager } from "@/components/boards/bugs/BugsManager";

// Mock BugsBoard to simulate a row action
jest.mock("@/components/boards/bugs/BugsBoard", () => ({
  BugsBoard: ({ handleRowAction, topContent, showCompleted = false }: any) => (
    <div
      data-testid={showCompleted ? "bugs-board-archives" : "bugs-board-main"}
    >
      {topContent}
      <button
        data-testid="row-action"
        onClick={() => handleRowAction("bug123")}
      >
        Row Action
      </button>
    </div>
  ),
}));

// Mock AddBugButton to render a button
jest.mock("@/components/boards/bugs/AddBugButton", () => ({
  AddBugButton: () => <button data-testid="add-bug-btn">Add Bug</button>,
}));

// Mock SimpleAccordion to render its children
jest.mock("@/components/rnd/SimpleAccordion", () => ({
  __esModule: true,
  default: ({ children, title }: any) => (
    <div data-testid={`accordion-${title}`}>{children}</div>
  ),
}));

// Mock BugsModal for edit mode
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
    visible ? (
      <div data-testid="edit-bugs-modal">
        <button onClick={() => onSave({ title: "Edited Bug" })}>
          Save Edit
        </button>
        <button onClick={onClose}>Close Edit Modal</button>
      </div>
    ) : null,
}));

describe("BugsManager", () => {
  const sessionUsername = "tester";
  const isAdminSide = false;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders main and archives boards with add bug button", () => {
    render(
      <BugsManager
        isAdminSide={isAdminSide}
        sessionUsername={sessionUsername}
      />,
    );
    expect(screen.getByTestId("add-bug-btn")).toBeInTheDocument();
    expect(screen.getByTestId("bugs-board-main")).toBeInTheDocument();
    expect(screen.getByTestId("accordion-archives")).toBeInTheDocument();
    // The accordion should render its child board for completed bugs
    expect(screen.getByTestId("bugs-board-archives")).toBeInTheDocument();
  });

  it("opens edit modal when a row action is triggered and saves bug", async () => {
    // Simulate fetch for bug details when row action is triggered
    const bugResponse = {
      id: "bug123",
      title: "Bug Title",
      description: "Desc",
      createdDate: "2020-01-01",
      createdBy: "User1",
      priority: "HIGH",
      status: "OPEN",
    };

    // First fetch for bug details
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => bugResponse,
    } as Response);
    // Second fetch for saving the bug edit
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    render(
      <BugsManager
        isAdminSide={isAdminSide}
        sessionUsername={sessionUsername}
      />,
    );
    // Use userEvent.click directly
    await userEvent.click(screen.getAllByTestId("row-action")[0]);
    const modal = await screen.findByTestId("edit-bugs-modal");

    expect(modal).toBeInTheDocument();
    await userEvent.click(screen.getByText("Save Edit"));
    await waitFor(() => {
      expect(screen.queryByTestId("edit-bugs-modal")).not.toBeInTheDocument();
    });
  });
});
