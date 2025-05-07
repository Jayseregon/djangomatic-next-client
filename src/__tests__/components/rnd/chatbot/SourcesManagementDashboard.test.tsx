import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SourcesManagementDashboard } from "@/components/rnd/chatbot/SourcesManagementDashboard";
import {
  getChromaSourceByCollections,
  deleteChromaSourceFromCollection,
} from "@/actions/chatbot/chroma/action";
import {
  ChromaCollectionSourcesResponse,
  ChromaDeleteSourceResponse,
} from "@/interfaces/chatbot";

// Mock the server actions
jest.mock("@/actions/chatbot/chroma/action", () => ({
  getChromaSourceByCollections: jest.fn(),
  deleteChromaSourceFromCollection: jest.fn(),
}));

// Silence console.error during tests
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the HeroUI components that aren't in the mock file
jest.mock("@heroui/react", () => {
  const originalModule = jest.requireActual("@heroui/react");

  // Add the missing Accordion components
  return {
    ...originalModule,
    Accordion: ({ children, className, selectionMode, variant }: any) => (
      <div
        className={className}
        data-selection-mode={selectionMode}
        data-testid="accordion"
        data-variant={variant}
      >
        {children}
      </div>
    ),
    // Fix: Don't destructure key property
    AccordionItem: (props: any) => {
      // Render the title if it's a string or a complex element
      let renderedTitle;

      if (typeof props.title === "string") {
        renderedTitle = props.title;
      } else if (React.isValidElement(props.title)) {
        renderedTitle = (
          <div data-testid="accordion-item-title">{props.title}</div>
        );
      }

      return (
        <div data-testid="accordion-item" data-text-value={props.textValue}>
          {renderedTitle}
          <div data-testid="accordion-item-content">{props.children}</div>
        </div>
      );
    },
    // Override Spinner mock to differentiate between main loading and button loading
    Spinner: ({
      label,
      color,
      size,
      "aria-label": ariaLabel,
      ...props
    }: any) => (
      <div
        aria-label={ariaLabel}
        data-color={color}
        data-size={size}
        // Use size="sm" to identify the spinner inside the refresh button
        data-testid={
          size === "sm" ? "button-loading-spinner" : "loading-spinner"
        }
        role="progressbar"
        {...props}
      >
        {label}
      </div>
    ),
  };
});

describe("SourcesManagementDashboard", () => {
  const mockSources: ChromaCollectionSourcesResponse = {
    collections: {
      collection1: ["source1", "source2"],
      collection2: ["source3", "source4", "source5"],
    },
  };

  const mockDeleteResponse: ChromaDeleteSourceResponse = {
    status: "success",
    message: "Source deleted successfully",
    documents_deleted: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for successful data fetching
    (getChromaSourceByCollections as jest.Mock).mockResolvedValue(mockSources);
    (deleteChromaSourceFromCollection as jest.Mock).mockResolvedValue(
      mockDeleteResponse,
    );
  });

  test("renders loading state initially", async () => {
    // Render is wrapped in act implicitly by RTL >= 13
    render(<SourcesManagementDashboard />);

    // Use findByTestId which includes waitFor
    const loadingSpinners = await screen.findAllByTestId("loading-spinner");

    expect(loadingSpinners.length).toBeGreaterThan(0);

    // Title should be visible even during loading
    expect(screen.getByText("Content Sources")).toBeInTheDocument();
  });

  test("renders sources after successful loading", async () => {
    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Check that collections are rendered
    expect(screen.getByText("collection1")).toBeInTheDocument();
    expect(screen.getByText("collection2")).toBeInTheDocument();

    // Check that source counts are displayed using more robust queries
    const countSpans = screen
      .getAllByText(/sources/i)
      .filter((span) => span.tagName === "SPAN");

    expect(countSpans.length).toBe(2); // Ensure we find both count spans
    expect(countSpans[0]).toHaveTextContent("2 sources");
    expect(countSpans[1]).toHaveTextContent("3 sources");
  });

  test("handles empty sources gracefully", async () => {
    (getChromaSourceByCollections as jest.Mock).mockResolvedValue({
      collections: {},
    });

    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Should show empty state message
    expect(screen.getByText(/No sources available/)).toBeInTheDocument();
  });

  test("handles error state correctly", async () => {
    // Mock API error
    (getChromaSourceByCollections as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch sources"),
    );

    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Should display error message
    expect(screen.getByText("Failed to fetch sources")).toBeInTheDocument();
  });

  test("search functionality filters collections and sources", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Get the search input and type in it
    const searchInput = screen.getByRole("searchbox");

    await user.type(searchInput, "collection1");

    // Should keep "collection1" visible but hide "collection2"
    expect(screen.getByText("collection1")).toBeInTheDocument();
    expect(screen.queryByText("collection2")).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);

    // Should show both again
    expect(screen.getByText("collection1")).toBeInTheDocument();
    expect(screen.getByText("collection2")).toBeInTheDocument();

    // Search for a specific source
    await user.type(searchInput, "source3");

    // Should hide collection1 and keep collection2 which contains source3
    expect(screen.queryByText("collection1")).not.toBeInTheDocument();
    expect(screen.getByText("collection2")).toBeInTheDocument();
  });

  test("refresh button reloads sources", async () => {
    // Introduce a slight delay for the second call to simulate network latency
    const delayedMockSources = () =>
      new Promise((resolve) => setTimeout(() => resolve(mockSources), 50));

    // Setup mocks: first call immediate, second call delayed
    (getChromaSourceByCollections as jest.Mock)
      .mockResolvedValueOnce(mockSources) // Initial load
      .mockImplementationOnce(delayedMockSources); // Refresh load

    // Render is wrapped in act implicitly by RTL >= 13
    render(<SourcesManagementDashboard />);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Find refresh button - it's the first button with RefreshCw icon
    const buttons = screen.getAllByRole("button");
    const refreshButton = buttons[0];

    // Click needs act because it triggers state updates
    await act(async () => {
      fireEvent.click(refreshButton);
    });

    // Should call the API again
    expect(getChromaSourceByCollections).toHaveBeenCalledTimes(2);

    // Check for the specific loading spinner inside the button using findByTestId
    // This will wait for the spinner to appear due to the delayed mock
    const buttonSpinner = await within(refreshButton).findByTestId(
      "button-loading-spinner",
    );

    expect(buttonSpinner).toBeInTheDocument();

    // Wait for the loading to finish again (spinner disappears)
    await waitFor(() => {
      expect(
        within(refreshButton).queryByTestId("button-loading-spinner"),
      ).not.toBeInTheDocument();
    });
  });

  test("handles source deletion", async () => {
    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Find all delete buttons (they have Trash2 icon)
    const deleteButtons = screen.getAllByRole("button").slice(1); // Skip the refresh button

    expect(deleteButtons.length).toBeGreaterThan(0);

    await act(async () => {
      // Click the first delete button
      fireEvent.click(deleteButtons[0]);
    });

    // Should call deleteChromaSourceFromCollection
    expect(deleteChromaSourceFromCollection).toHaveBeenCalled();

    // Toast should be displayed after deletion
    await waitFor(() => {
      expect(
        screen.getByText("Source removed successfully"),
      ).toBeInTheDocument();
    });
  });

  test("handles deletion errors", async () => {
    // Mock deletion error
    (deleteChromaSourceFromCollection as jest.Mock).mockRejectedValue(
      new Error("Failed to delete source"),
    );

    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Find all delete buttons
    const deleteButtons = screen.getAllByRole("button").slice(1); // Skip the refresh button

    await act(async () => {
      // Click the first delete button
      fireEvent.click(deleteButtons[0]);
    });

    // Error toast should be displayed
    await waitFor(() => {
      expect(screen.getByText("Failed to remove source")).toBeInTheDocument();
    });
  });

  test("clears search when clear button is clicked", async () => {
    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Get the search input
    const searchInput = screen.getByRole("searchbox");

    await act(async () => {
      // Type in search
      fireEvent.change(searchInput, { target: { value: "collection1" } });
    });

    // Search should filter results
    expect(screen.getByText("collection1")).toBeInTheDocument();
    expect(screen.queryByText("collection2")).not.toBeInTheDocument();

    // Find clear button
    const clearButton = screen.getByText("Clear");

    await act(async () => {
      // Click clear button
      fireEvent.click(clearButton);
    });

    // Should show all collections again
    expect(screen.getByText("collection1")).toBeInTheDocument();
    expect(screen.getByText("collection2")).toBeInTheDocument();
  });

  test("toast can be closed", async () => {
    await act(async () => {
      render(<SourcesManagementDashboard />);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Delete a source to show the toast
    const deleteButtons = screen.getAllByRole("button").slice(1);

    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    // Toast should appear
    await waitFor(() => {
      expect(
        screen.getByText("Source removed successfully"),
      ).toBeInTheDocument();
    });

    // Close the toast
    const closeButton = screen.getByTestId("close-button");

    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Toast should disappear
    await waitFor(() => {
      expect(
        screen.queryByText("Source removed successfully"),
      ).not.toBeInTheDocument();
    });
  });

  test("updates local state after successful deletion", async () => {
    // Set up the deleted collection/source for testing
    const collectionToTest = "collection1";
    const sourceToDelete = "source1";

    // Mock implementation to simulate the deletion
    (deleteChromaSourceFromCollection as jest.Mock).mockImplementation(
      (collection, source) => {
        expect(collection).toBe(collectionToTest);
        expect(source).toBe(sourceToDelete);

        return Promise.resolve(mockDeleteResponse); // Return success to trigger local update
      },
    );

    // Render is wrapped in act implicitly by RTL >= 13
    render(<SourcesManagementDashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Initial count should be 2 sources for collection1
    const collection1Text = screen.getByText("collection1");

    expect(collection1Text).toBeInTheDocument();

    // Find the accordion item for collection1
    const collectionItems = screen.getAllByTestId("accordion-item");
    const collection1Item = collectionItems.find((item) =>
      within(item).queryByText("collection1"),
    );

    expect(collection1Item).toBeDefined();
    const initialCountSpan = within(collection1Item!).getByText(/sources/i);

    expect(initialCountSpan).toHaveTextContent("2 sources");

    // Click on collection1 to expand it - needs act
    await act(async () => {
      fireEvent.click(collection1Text);
    });

    // Now source1 should be visible within the collection item
    await waitFor(() => {
      expect(
        within(collection1Item!).getByText(sourceToDelete),
      ).toBeInTheDocument();
    });

    // Find the delete button for source1 within the collection item
    const source1Element = within(collection1Item!).getByText(sourceToDelete);
    const sourceContainer = source1Element.closest("div.flex-1")?.parentElement;
    const deleteButton = sourceContainer?.querySelector("button");

    expect(deleteButton).not.toBeNull();

    // Click the delete button with act()
    await act(async () => {
      fireEvent.click(deleteButton!);
    });

    // Verify the delete API was called
    expect(deleteChromaSourceFromCollection).toHaveBeenCalledWith(
      collectionToTest,
      sourceToDelete,
    );

    // Verify fetchSources was NOT called again (local state update)
    expect(getChromaSourceByCollections).toHaveBeenCalledTimes(1); // Only initial call

    // After deletion, source1 should no longer be visible *within the accordion item*
    await waitFor(() => {
      // Use within to scope the query to the specific accordion item
      expect(
        within(collection1Item!).queryByText(sourceToDelete),
      ).not.toBeInTheDocument();
    });

    // Check that source2 is still there within the accordion item
    expect(within(collection1Item!).getByText("source2")).toBeInTheDocument();

    // Check that count is updated to 1 within the accordion item title
    const updatedCountSpan = within(collection1Item!).getByText(/sources/i);

    expect(updatedCountSpan).toHaveTextContent("1 sources");

    // Check that the toast shows the deleted source name
    // Find the toast root element (implicitly role="status")
    const toastRoot = await screen.findByRole("status");

    expect(toastRoot).toBeInTheDocument();
    expect(
      within(toastRoot).getByText("Source removed successfully"),
    ).toBeInTheDocument();
    // Verify the source name is within the toast
    expect(within(toastRoot).getByText(sourceToDelete)).toBeInTheDocument();
    // Verify the structure around the source name if needed
    const sourceNameElement = within(toastRoot).getByText(sourceToDelete);

    expect(sourceNameElement).toHaveClass(
      "font-light text-xs font-mono truncate max-w-[300px] text-background/70",
    );
  });
});
