import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GainTrackingStatus } from "@prisma/client";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/gains/GainsTrackingBoard";
import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import {
  updateGainsRecord,
  updateMonthlyCost,
} from "@/src/actions/prisma/tracking/action";

// Mock actions
jest.mock("@/src/actions/prisma/tracking/action", () => ({
  updateGainsRecord: jest.fn().mockResolvedValue({}),
  updateMonthlyCost: jest.fn().mockResolvedValue({}),
}));

// Mock dependencies
jest.mock("lucide-react", () => ({
  RefreshCcw: () => <div data-testid="refresh-icon">RefreshIcon</div>,
  CircleCheckBig: () => <div data-testid="check-icon">CheckIcon</div>,
  CircleOff: () => <div data-testid="off-icon">OffIcon</div>,
  Cog: () => <div data-testid="cog-icon">CogIcon</div>,
  Edit: () => <div data-testid="edit-icon">EditIcon</div>,
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Simpler mock for MonthlyGainsCostBoard - just expose what we need for testing
jest.mock("@/components/rnd/tracking/gains/MonthlyGainsCostBoard", () => ({
  MonthlyGainsCostBoard: (props: any) => (
    <div data-testid="monthly-costs-board">
      <span>Monthly Costs for {props.record.name}</span>
      {props.onUpdateMonthlyCost && (
        <button
          data-testid="update-cost-button"
          onClick={() =>
            props.onUpdateMonthlyCost("January", 500, {
              count: 5,
              rate: 100,
              adjustedCost: 0,
            })
          }
        >
          Update Cost
        </button>
      )}
      <span data-testid="loading-state">
        {props.isLoading ? "Loading" : "Not Loading"}
      </span>
    </div>
  ),
}));

// Simpler mock for EditGainsRecordModal
jest.mock("@/components/rnd/tracking/gains/EditGainsRecordModal", () => ({
  EditGainsRecordModal: (props: any) => (
    <div
      data-testid="edit-modal"
      style={{ display: props.isOpen ? "block" : "none" }}
    >
      <span>Edit {props.record?.name}</span>
      <button
        data-testid="save-edit-button"
        onClick={() =>
          props.onSave({
            id: props.record?.id,
            name: props.record?.name,
            timeInitial: 200,
            timeSaved: 100,
            hasGains: true,
            replaceOffshore: false,
            status: GainTrackingStatus.CLOSED,
          })
        }
      >
        Save
      </button>
      <button data-testid="close-edit-button" onClick={props.onClose}>
        Close
      </button>
    </div>
  ),
}));

// Simple mock for LoadingContent - no interaction needed for this component
jest.mock("@/components/ui/LoadingContent", () => ({
  LoadingContent: () => <div data-testid="loading-content">Loading...</div>,
}));

// Mock HeroUI useDisclosure hook
jest.mock("@heroui/react", () => {
  let isModalOpen = false;
  const openModal = jest.fn(() => {
    isModalOpen = true;
  });
  const closeModal = jest.fn(() => {
    isModalOpen = false;
  });

  // Define interfaces for components
  interface TableProps {
    children: React.ReactNode;
    onSelectionChange?: (key: string) => void;
    topContent?: React.ReactNode;
    "aria-label"?: string;
    selectedKeys?: Set<string>;
    [key: string]: any;
  }

  interface TableHeaderProps {
    children: React.ReactNode;
  }

  interface TableColumnProps {
    children: React.ReactNode;
    [key: string]: any;
  }

  interface TableBodyProps {
    children: React.ReactNode | ((item: any) => React.ReactNode);
    items?: Array<{
      id: string;
      [key: string]: any;
    }>;
    isLoading?: boolean;
    loadingContent?: React.ReactNode;
    emptyContent?: React.ReactNode;
  }

  interface TableRowProps {
    children: React.ReactNode;
    [key: string]: any;
  }

  interface TableCellProps {
    children: React.ReactNode;
    className?: string;
  }

  interface ButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    "aria-label"?: string;
    [key: string]: any;
  }

  return {
    Table: ({
      children,
      onSelectionChange,
      topContent,
      ...props
    }: TableProps) => {
      return (
        <div className="text-center">
          {topContent}
          <div className="overflow-x-auto">
            <table
              aria-label={props["aria-label"]}
              data-testid="gains-tracking-table"
            >
              {React.Children.map(children, (child) => {
                if (
                  child &&
                  typeof child === "object" &&
                  "type" in child &&
                  child.type &&
                  typeof child.type === "function" &&
                  child.type.name === "TableBody"
                ) {
                  // Fix: Cast the props to any to avoid TypeScript errors
                  return React.cloneElement(
                    child as React.ReactElement,
                    {
                      onSelectionChange,
                    } as any,
                  );
                }

                return child;
              })}
            </table>
          </div>
        </div>
      );
    },
    TableHeader: ({ children }: TableHeaderProps) => (
      <thead>
        <tr>{children}</tr>
      </thead>
    ),
    TableColumn: ({ children, ...props }: TableColumnProps) => (
      <th {...props}>{children}</th>
    ),
    TableBody: ({
      children,
      items,
      isLoading,
      loadingContent,
      emptyContent,
      onSelectionChange,
    }: TableBodyProps & { onSelectionChange?: any }) => {
      if (isLoading) {
        return (
          <tbody>
            <tr>
              <td colSpan={7}>{loadingContent}</td>
            </tr>
          </tbody>
        );
      }

      if (!items || items.length === 0) {
        return (
          <tbody>
            <tr>
              <td>{emptyContent || "No data available"}</td>
            </tr>
          </tbody>
        );
      }

      return (
        <tbody>
          {items.map((item) => {
            const row =
              typeof children === "function" ? children(item) : children;

            // Fix: Cast the props to any to avoid TypeScript errors
            return React.cloneElement(
              row as React.ReactElement,
              {
                key: item.id,
                "data-id": item.id,
                "data-testid": `table-row-${item.id}`,
                onClick: () => {
                  if (onSelectionChange) {
                    onSelectionChange(item.id);
                  }
                },
              } as any,
            );
          })}
        </tbody>
      );
    },
    TableRow: ({ children, ...props }: TableRowProps) => (
      <tr {...props}>{children}</tr>
    ),
    TableCell: ({ children, className }: TableCellProps) => (
      <td className={className}>{children}</td>
    ),
    Button: ({ children, onPress, ...props }: ButtonProps) => (
      <button
        data-testid={
          props["aria-label"]
            ? props["aria-label"].replace(/\s+/g, "-").toLowerCase()
            : props.children === "RefreshIcon"
              ? "refresh-button"
              : "button"
        }
        onClick={() => onPress && onPress()}
      >
        {children}
      </button>
    ),
    useDisclosure: () => ({
      isOpen: isModalOpen,
      onOpen: openModal,
      onClose: closeModal,
    }),
  };
});

describe("GainsTrackingBoard", () => {
  const mockReload = jest.fn();

  // Mock data for testing
  const mockData: GainsTrackingRecordItem[] = [
    {
      id: "1",
      createdAt: new Date("2023-01-01"),
      taskId: "task-1",
      name: "Test Task 1",
      hasGains: true,
      replaceOffshore: false,
      timeInitial: 100,
      timeSaved: 50,
      region: "US",
      comments: "Test comment",
      status: GainTrackingStatus.OPEN,
      monthlyCosts: [
        {
          id: "cost-1",
          gainsRecordId: "1",
          fiscalYear: 2023,
          month: "January",
          cost: 1000,
          count: 10,
          rate: 100,
          adjustedCost: 0,
        },
      ],
    },
    {
      id: "2",
      createdAt: new Date("2023-02-01"),
      taskId: "task-2",
      name: "Test Task 2",
      hasGains: false,
      replaceOffshore: true,
      timeInitial: 200,
      timeSaved: 100,
      region: "EU",
      status: GainTrackingStatus.CLOSED,
      monthlyCosts: [],
    },
  ];

  const defaultProps = {
    data: mockData,
    reload: mockReload,
    selectedYear: 2023,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table with data correctly", () => {
    render(<GainsTrackingBoard {...defaultProps} />);

    // Verify task names are rendered
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();

    // Verify regions are rendered
    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("EU")).toBeInTheDocument();

    // Fix: Use getAllByText for ambiguous text elements
    const timeInitialCells = screen.getAllByText("100");
    const timeSavedCells = screen.getAllByText("50");

    expect(timeInitialCells.length).toBeGreaterThan(0);
    expect(timeSavedCells.length).toBeGreaterThan(0);

    expect(screen.getByText("Test comment")).toBeInTheDocument();

    // Verify status badges
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Closed")).toBeInTheDocument();

    // Verify heading and description
    expect(screen.getByText("Showing data for 2023")).toBeInTheDocument();
  });

  it("renders empty state when no data is available", () => {
    render(<GainsTrackingBoard {...defaultProps} data={[]} />);

    expect(screen.getByText("No entries found")).toBeInTheDocument();
  });

  it("shows monthly costs board when a record is selected", async () => {
    const { container } = render(<GainsTrackingBoard {...defaultProps} />);

    // Find and click the first row
    const firstRow = container.querySelector(`[data-testid="table-row-1"]`);

    fireEvent.click(firstRow!);

    // The MonthlyGainsCostBoard should be rendered with the selected record
    const monthlyBoard = await screen.findByTestId("monthly-costs-board");

    expect(monthlyBoard).toBeInTheDocument();

    // Fix: Check within the monthly board component for the text
    const costBoardTexts = screen.getAllByText(/Monthly Costs for Test Task 1/);

    expect(costBoardTexts.length).toBeGreaterThan(0);
    expect(costBoardTexts[0]).toBeInTheDocument();
  });

  it("updates monthly cost when update is triggered", async () => {
    // Fix: Completely revise the test approach
    // Instead of trying to mock useState, directly render the component with the row click

    const { container } = render(<GainsTrackingBoard {...defaultProps} />);

    // Find and click the first row to select it
    const firstRow = container.querySelector(`[data-testid="table-row-1"]`);

    fireEvent.click(firstRow!);

    // Wait for the monthly costs board to appear
    const monthlyBoard = await screen.findByTestId("monthly-costs-board");

    expect(monthlyBoard).toBeInTheDocument();

    // Find the update button in the monthly costs board
    const updateButton = await screen.findByTestId("update-cost-button");

    expect(updateButton).toBeInTheDocument();

    // Click the button to trigger the update
    fireEvent.click(updateButton);

    // Verify the updateMonthlyCost action was called with correct parameters
    await waitFor(() => {
      expect(updateMonthlyCost).toHaveBeenCalledWith(
        "1", // record ID
        "January", // month
        500, // new cost
        5, // count
        100, // rate
        0, // adjustedCost
      );
    });
  });

  it("opens edit modal when edit button is clicked", async () => {
    render(<GainsTrackingBoard {...defaultProps} />);

    // Find the edit button for the first record and click it
    const editButtons = screen.getAllByTestId("edit-record");

    fireEvent.click(editButtons[0]);

    // Verify the modal is shown
    await waitFor(() => {
      const editModal = screen.getByTestId("edit-modal");

      expect(editModal).toBeInTheDocument();
      expect(editModal).toHaveStyle("display: block");
      expect(screen.getByText("Edit Test Task 1")).toBeInTheDocument();
    });
  });

  it("updates record when edit is saved", async () => {
    render(<GainsTrackingBoard {...defaultProps} />);

    // Find the edit button for the first record and click it
    const editButtons = screen.getAllByTestId("edit-record");

    fireEvent.click(editButtons[0]);

    // Find the save button in the modal and click it
    const saveButton = await screen.findByTestId("save-edit-button");

    fireEvent.click(saveButton);

    // Verify the updateGainsRecord action was called with correct parameters
    await waitFor(() => {
      expect(updateGainsRecord).toHaveBeenCalledWith("1", {
        hasGains: true,
        replaceOffshore: false,
        timeInitial: 200,
        timeSaved: 100,
        status: GainTrackingStatus.CLOSED,
      });
    });
  });

  it("calls reload function when refresh button is clicked", () => {
    render(<GainsTrackingBoard {...defaultProps} />);

    // Fix: Use the actual test ID from the DOM ("button" instead of "refresh-button")
    // The button contains the refresh icon
    const refreshButton = screen.getByTestId("button");

    expect(refreshButton).toBeInTheDocument();

    // Verify the button has the refresh icon as a child
    const refreshIcon = screen.getByTestId("refresh-icon");

    expect(refreshIcon).toBeInTheDocument();
    expect(refreshButton).toContainElement(refreshIcon);

    // Click the button
    fireEvent.click(refreshButton);

    // Verify the reload function was called
    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
