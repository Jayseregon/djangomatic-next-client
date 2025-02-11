import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BugsModal } from "@/components/boards/bugs/BugsModal";
import { BugPriority, BugStatus } from "@/interfaces/bugs";

// Mock translations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock DatePicker component
jest.mock("@/components/ui/DatePicker", () => ({
  DatePicker: ({ label, onChange }: any) => (
    <input
      aria-label={label}
      type="date"
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

describe("BugsModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnBugChange = jest.fn();
  const sessionUsername = "testUser";

  // Mock dev users data
  const mockDevUsers = [
    { id: "u1", name: "Dev1", canAccessRnd: true },
    { id: "u2", name: "Dev2", canAccessRnd: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Replace the fetch mock to return a proper Response instance
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(mockDevUsers), {
        status: 200,
        statusText: "OK",
        headers: new Headers(),
      }),
    );
  });

  describe("Add Mode", () => {
    it("renders add mode with correct initial state", async () => {
      await act(async () => {
        render(
          <BugsModal
            isAdminSide={true}
            mode="add"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      expect(screen.getByText("modal.addNew")).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.queryByLabelText("Delete Bug")).not.toBeInTheDocument();
    });

    it("calls onSave with correct data when saving new bug", async () => {
      await act(async () => {
        render(
          <BugsModal
            isAdminSide={true}
            mode="add"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      await act(async () => {
        await userEvent.type(screen.getByLabelText(/title/i), "New Bug");
        await userEvent.type(
          screen.getByLabelText(/description/i),
          "Test Description",
        );
      });

      await act(async () => {
        const saveButton = screen.getByLabelText("Save Bug");

        await userEvent.click(saveButton);
      });

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Bug",
          description: "Test Description",
          createdBy: sessionUsername,
          priority: BugPriority.LOW,
          status: BugStatus.OPEN,
        }),
      );
    });
  });

  describe("Edit Mode", () => {
    const mockBug = {
      id: "bug1",
      title: "Existing Bug",
      description: "Bug Description",
      status: BugStatus.OPEN,
      priority: BugPriority.HIGH,
      createdBy: sessionUsername,
    };

    it("renders edit mode with existing bug data", async () => {
      await act(async () => {
        render(
          <BugsModal
            initialBug={mockBug}
            isAdminSide={true}
            mode="edit"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      expect(screen.getByText("modal.editBug")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete Bug")).toBeInTheDocument();
      expect(screen.getByLabelText("tableColumns.title")).toHaveValue(
        "Existing Bug",
      );
    });

    it("calls API and handlers when deleting bug", async () => {
      const mockFetch = global.fetch as jest.Mock;

      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve(
            new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: new Headers(),
            }),
          ),
        )
        // Ensure subsequent fetch (e.g. for dev users) returns an array
        .mockImplementationOnce(() =>
          Promise.resolve(
            new Response(JSON.stringify(mockDevUsers), {
              status: 200,
              headers: new Headers(),
            }),
          ),
        );

      await act(async () => {
        render(
          <BugsModal
            initialBug={mockBug}
            isAdminSide={true}
            mode="edit"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      await act(async () => {
        const deleteButton = screen.getByLabelText("Delete Bug");

        await userEvent.click(deleteButton);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/bug-report/delete",
        expect.any(Object),
      );
      expect(mockOnBugChange).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Modal Visibility", () => {
    it("does not render when visible is false", () => {
      render(
        <BugsModal
          isAdminSide={true}
          mode="add"
          sessionUsername={sessionUsername}
          visible={false}
          onBugChange={mockOnBugChange}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />,
      );

      expect(screen.queryByText("modal.addNew")).not.toBeInTheDocument();
    });
  });

  describe("Admin vs Non-Admin View", () => {
    it("shows assignee select for admin users", async () => {
      await act(async () => {
        render(
          <BugsModal
            isAdminSide={true}
            mode="add"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      expect(screen.getByLabelText("Assigned To")).toBeInTheDocument();
      expect(
        await screen.findByRole("option", { name: "Dev1" }),
      ).toBeInTheDocument();
    });

    it("shows read-only input for non-admin users", async () => {
      await act(async () => {
        render(
          <BugsModal
            isAdminSide={false}
            mode="add"
            sessionUsername={sessionUsername}
            visible={true}
            onBugChange={mockOnBugChange}
            onClose={mockOnClose}
            onSave={mockOnSave}
          />,
        );
      });

      const assignedToInput = screen.getByLabelText("tableColumns.assignedTo");

      expect(assignedToInput).toHaveAttribute("readonly");
    });
  });
});
