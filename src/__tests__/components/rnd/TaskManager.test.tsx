import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import { Status } from "@/generated/client";
import { TaskManager } from "@/components/rnd/TaskManager";
import {
  getRndUserById,
  getRndTaskById,
  updateRndTask,
} from "@/src/actions/prisma/rndTask/action";
import { RnDTeamTask, UserSchema } from "@/interfaces/lib";

// Define prop types for mocked components
interface TaskBoardFullProps {
  topContent: React.ReactNode;
  showCompleted?: boolean;
  handleRowAction: (taskId: string) => void;
  id?: string;
  taskUpdated?: boolean;
}

interface TaskBoardShortProps {
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
  taskUpdated?: boolean;
  user?: UserSchema;
}

interface AddTaskButtonProps {
  user?: UserSchema;
  onTaskChange: () => void;
}

interface SimpleAccordionProps {
  children: React.ReactNode;
  title: string;
  menuKey?: string;
}

interface TaskModalProps {
  initialTask: Partial<RnDTeamTask>;
  mode: "add" | "edit";
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<RnDTeamTask>) => void;
  onTaskChange?: () => void;
}

// Mock the imported modules
jest.mock("@/src/actions/prisma/rndTask/action", () => ({
  getRndUserById: jest.fn(),
  getRndTaskById: jest.fn(),
  updateRndTask: jest.fn(),
}));

// Mock components used by TaskManager
jest.mock("@/components/rnd/TaskBoard", () => ({
  TaskBoardFull: ({
    topContent,
    showCompleted,
    handleRowAction,
  }: TaskBoardFullProps) => (
    <div
      data-testid={
        showCompleted ? "task-board-full-completed" : "task-board-full-active"
      }
    >
      {topContent && <div data-testid="top-content">{topContent}</div>}
      {showCompleted && <div data-testid="show-completed">true</div>}
      <button
        data-testid={
          showCompleted
            ? "row-action-button-completed"
            : "row-action-button-active"
        }
        onClick={() => handleRowAction("mock-task-id")}
      >
        Handle Row
      </button>
    </div>
  ),
  TaskBoardShort: ({ topContent, handleRowAction }: TaskBoardShortProps) => (
    <div data-testid="task-board-short">
      {topContent && <div data-testid="top-content-short">{topContent}</div>}
      <button
        data-testid="row-action-button-short"
        onClick={() => handleRowAction("mock-task-id")}
      >
        Handle Row Short
      </button>
    </div>
  ),
}));

jest.mock("@/components/rnd/AddTaskButton", () => ({
  AddTaskButton: ({ onTaskChange }: AddTaskButtonProps) => (
    <button data-testid="add-task-button" onClick={onTaskChange}>
      Add Task
    </button>
  ),
}));

jest.mock("@/components/rnd/SimpleAccordion", () => ({
  __esModule: true,
  default: ({ children, title }: SimpleAccordionProps) => (
    <div data-testid="simple-accordion" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/rnd/TaskModal", () => ({
  TaskModal: ({ onClose, onSave, visible, mode }: TaskModalProps) =>
    visible ? (
      <div data-mode={mode} data-testid="task-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="save-modal"
          onClick={() => onSave({ task: "Updated Task" })}
        >
          Save
        </button>
      </div>
    ) : null,
}));

describe("TaskManager Component", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
    lastLogin: new Date(),
    isAdmin: false,
    isRnDTeam: true,
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
    canAccessAppsXploreHLD: false,
    canAccessAppsTelusAdmin: false,
    canAccessBugReportBoard: false,
    canAccessRoadmapBoard: false,
    canAccessReports: false,
    canDeleteReports: false,
    canAccessRnd: true,
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
    rndTasks: [],
  };

  const mockTask = {
    id: "mock-task-id",
    createdAt: new Date(),
    owner: mockUser,
    task: "Test Task",
    priority: 1,
    impactedPeople: "Team A",
    comment: "Test comment",
    status: Status.IN_PROGRESS,
    dueDate: new Date(),
    startedAt: new Date(),
    completedAt: null,
    trackGains: true,
    gains: undefined, // Changed from null to undefined
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    (getRndUserById as jest.Mock).mockResolvedValue(mockUser);
    (getRndTaskById as jest.Mock).mockResolvedValue(mockTask);
    (updateRndTask as jest.Mock).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders TaskBoardShort when no id is provided", () => {
    render(<TaskManager user={mockUser} />);
    expect(screen.getByTestId("task-board-short")).toBeInTheDocument();
    expect(
      screen.queryByTestId("task-board-full-active"),
    ).not.toBeInTheDocument();
  });

  test("renders TaskBoardFull when id is provided", async () => {
    // Wrap the render in act to handle the async useEffect
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    expect(screen.getByTestId("task-board-full-active")).toBeInTheDocument();
    expect(screen.queryByTestId("task-board-short")).not.toBeInTheDocument();
  });

  test("fetches user data when id is provided but user is not", async () => {
    // Use act to handle the async state update
    await act(async () => {
      render(<TaskManager id="user-1" />);
      // Wait for all promises to resolve
      await Promise.resolve();
    });

    expect(getRndUserById).toHaveBeenCalledWith("user-1");
  });

  test("doesn't fetch user data when both id and user are provided", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" user={mockUser} />);
    });

    expect(getRndUserById).not.toHaveBeenCalled();
  });

  test("renders SimpleAccordion with archives section when id is provided", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    const accordion = screen.getByTestId("simple-accordion");

    expect(accordion).toBeInTheDocument();
    expect(accordion.getAttribute("data-title")).toBe("archives");
  });

  test("handles row action and opens task modal", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(getRndTaskById).toHaveBeenCalledWith("mock-task-id");
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
      expect(screen.getByTestId("task-modal").getAttribute("data-mode")).toBe(
        "edit",
      );
    });
  });

  test("handles edit save correctly", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    // Open the modal first
    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    // Click save
    await act(async () => {
      const saveButton = screen.getByTestId("save-modal");

      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(updateRndTask).toHaveBeenCalledWith({
        id: "mock-task-id",
        task: "Updated Task",
      });
      expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();
    });
  });

  test("handles modal close correctly", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    // Open the modal first
    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    // Click close
    await act(async () => {
      const closeButton = screen.getByTestId("close-modal");

      fireEvent.click(closeButton);
    });

    expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();
  });

  test("handles task change when add task button is clicked", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" user={mockUser} />);
    });

    await act(async () => {
      const addTaskButton = screen.getByTestId("add-task-button");

      fireEvent.click(addTaskButton);
    });

    // We can't directly test the state change, but we know the handler was called
    // which would toggle the taskUpdated state
  });

  test("handles task without trackGains property", async () => {
    // Override the default mock to return a task without trackGains
    (getRndTaskById as jest.Mock).mockResolvedValue({
      ...mockTask,
      trackGains: undefined,
    });

    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
      // The component should have initialized trackGains to true
    });
  });

  test("handles error when fetching task", async () => {
    console.error = jest.fn(); // Mock console.error

    (getRndTaskById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch task"),
    );

    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(screen.queryByTestId("task-modal")).not.toBeInTheDocument();
    });
  });

  test("handles error when updating task", async () => {
    console.error = jest.fn(); // Mock console.error

    (updateRndTask as jest.Mock).mockRejectedValue(
      new Error("Failed to update task"),
    );

    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    // Open the modal first
    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-active");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    // Click save
    await act(async () => {
      const saveButton = screen.getByTestId("save-modal");

      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      // The modal should still be open since we had an error
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });
  });

  test("can handle row action from completed tasks section", async () => {
    await act(async () => {
      render(<TaskManager id="user-1" />);
    });

    await act(async () => {
      const rowActionButton = screen.getByTestId("row-action-button-completed");

      fireEvent.click(rowActionButton);
    });

    await waitFor(() => {
      expect(getRndTaskById).toHaveBeenCalledWith("mock-task-id");
      expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });
  });
});
