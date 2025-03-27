import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Status } from "@prisma/client";

import { AddTaskButton } from "@/components/rnd/AddTaskButton";
import { createRndTask } from "@/src/actions/prisma/rndTask/action";
import { TaskModal } from "@/components/rnd/TaskModal";
import { TriggerButton } from "@/components/rnd/TriggerButton";

// Mock dependencies
jest.mock("@/src/actions/prisma/rndTask/action", () => ({
  createRndTask: jest.fn(),
}));

jest.mock("@/components/rnd/TaskModal", () => ({
  TaskModal: jest.fn(({ visible, onSave, onClose }) =>
    visible ? (
      <div data-testid="task-modal">
        <button
          data-testid="save-button"
          onClick={() => onSave({ task: "New Task", status: Status.CREATED })}
        >
          Save
        </button>
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
  ),
}));

jest.mock("@/components/rnd/TriggerButton", () => ({
  TriggerButton: jest.fn(({ onClick }) => (
    <button data-testid="trigger-button" onClick={onClick}>
      Add Task
    </button>
  )),
}));

describe("AddTaskButton", () => {
  const mockUser = {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    isAdmin: false,
    isRnDTeam: true,
    canAccessRnd: true,
    createdAt: new Date(),
    lastLogin: new Date(),
    rndTasks: [],
    // Add all required properties with default values
    canAccessChatbot: false,
    canAccessAppsTdsHLD: false,
    canAccessAppsTdsLLD: false,
    canAccessAppsTdsArcGIS: false,
    canAccessAppsTdsOverride: false,
    canAccessAppsTdsAdmin: false,
    canAccessAppsTdsSuper: false,
    canAccessAppsCogecoHLD: false,
    canAccessAppsVistabeamHLD: false,
    canAccessAppsVistabeamOverride: false,
    canAccessAppsVistabeamSuper: false,
    canAccessAppsXploreAdmin: false,
    canAccessAppsTelusAdmin: false,
    canAccessBugReportBoard: false,
    canAccessRoadmapBoard: false,
    canAccessReports: false,
    canDeleteReports: false,
    canAccessDocsTDS: false,
    canAccessDocsCogeco: false,
    canAccessDocsVistabeam: false,
    canAccessDocsXplore: false,
    canAccessDocsComcast: false,
    canAccessDocsAdmin: false,
    canAccessDocsKC: false,
    canAccessDocsKCSecure: false,
    canAccessVideoAdmin: false,
    canAccessVideoGIS: false,
    canAccessVideoCAD: false,
    canAccessVideoLiDAR: false,
    canAccessVideoEng: false,
    canAccessVideoSttar: false,
  };

  const mockOnTaskChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createRndTask as jest.Mock).mockResolvedValue({ id: "new-task-1" });
  });

  it("renders the TriggerButton", () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    expect(screen.getByTestId("trigger-button")).toBeInTheDocument();
    expect(TriggerButton).toHaveBeenCalled();
  });

  it("initially does not display the TaskModal", () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();

    // Updated expectation: Check that TaskModal was called and the first argument contains the expected properties
    // But don't make assumptions about the second argument
    expect(TaskModal).toHaveBeenCalled();
    expect((TaskModal as jest.Mock).mock.calls[0][0]).toEqual(
      expect.objectContaining({
        visible: false,
        mode: "add",
        currentUser: mockUser,
      }),
    );
  });

  it("opens the TaskModal when the TriggerButton is clicked", async () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    const triggerButton = screen.getByTestId("trigger-button");

    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();

      // Verify TaskModal was called with updated visible prop
      const lastCall = (TaskModal as jest.Mock).mock.calls[
        (TaskModal as jest.Mock).mock.calls.length - 1
      ];

      expect(lastCall[0].visible).toBe(true);
    });
  });

  it("closes the TaskModal when onClose is called", async () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    // Open the modal
    const triggerButton = screen.getByTestId("trigger-button");

    fireEvent.click(triggerButton);

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByTestId("close-button");

    fireEvent.click(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();
    });
  });

  it("saves a task and calls onTaskChange when onSave is called", async () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    // Open the modal
    const triggerButton = screen.getByTestId("trigger-button");

    fireEvent.click(triggerButton);

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    // Save the task
    const saveButton = screen.getByTestId("save-button");

    fireEvent.click(saveButton);

    // Verify createRndTask was called with the correct data
    await waitFor(() => {
      expect(createRndTask).toHaveBeenCalledWith(
        expect.objectContaining({
          task: "New Task",
          status: Status.CREATED,
        }),
      );

      // Verify onTaskChange was called
      expect(mockOnTaskChange).toHaveBeenCalledTimes(1);

      // Verify modal is closed after saving
      expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();
    });
  });

  it("handles errors when saving fails", async () => {
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;

    console.error = jest.fn();

    // Mock createRndTask to reject
    (createRndTask as jest.Mock).mockRejectedValueOnce(
      new Error("Save failed"),
    );

    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    // Open the modal
    const triggerButton = screen.getByTestId("trigger-button");

    fireEvent.click(triggerButton);

    // Save the task
    const saveButton = await screen.findByTestId("save-button");

    fireEvent.click(saveButton);

    // Verify error is logged and modal stays open
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error saving task:",
        expect.any(Error),
      );

      // Modal should still be open
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();

      // onTaskChange should not be called
      expect(mockOnTaskChange).not.toHaveBeenCalled();
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("passes the correct props to TaskModal", () => {
    render(<AddTaskButton user={mockUser} onTaskChange={mockOnTaskChange} />);

    // Only check for the presence of specific props we care about
    // The actual component also passes onClose and onSave functions that we don't need to validate
    const lastCallArgs = (TaskModal as jest.Mock).mock.calls[0][0];

    expect(lastCallArgs).toMatchObject({
      currentUser: mockUser,
      mode: "add",
      visible: false,
      onTaskChange: mockOnTaskChange,
    });

    // Check that onClose and onSave are functions
    expect(typeof lastCallArgs.onClose).toBe("function");
    expect(typeof lastCallArgs.onSave).toBe("function");
  });

  it("works without a user prop", async () => {
    render(<AddTaskButton onTaskChange={mockOnTaskChange} />);

    // Open the modal
    const triggerButton = screen.getByTestId("trigger-button");

    fireEvent.click(triggerButton);

    // Save the task
    const saveButton = await screen.findByTestId("save-button");

    fireEvent.click(saveButton);

    // Verify task was created even without a user
    await waitFor(() => {
      expect(createRndTask).toHaveBeenCalled();
      expect(mockOnTaskChange).toHaveBeenCalled();
    });
  });
});
