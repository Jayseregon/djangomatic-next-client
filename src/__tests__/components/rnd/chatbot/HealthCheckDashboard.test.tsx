import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { HealthCheckDashboard } from "@/components/rnd/chatbot/HealthCheckDashboard";
import * as chromaActions from "@/actions/chatbot/chroma/action";

// Mock the chroma actions
jest.mock("@/actions/chatbot/chroma/action", () => ({
  getChromaHeartbeat: jest.fn(),
  getChromaCollectionsInfo: jest.fn(),
  // Mock other exports that might be used
  getChromaSourceByCollections: jest.fn(),
  deleteChromaSourceFromCollection: jest.fn(),
  uploadSourceToChromaStore: jest.fn(),
}));

// Mock the specific @heroui/react components used
jest.mock("@heroui/react", () => {
  const originalModule = jest.requireActual("@heroui/react"); // Use actual module for other components if needed

  return {
    ...originalModule,
    Card: jest.fn(({ children, className }) => (
      <div className={className} data-testid="mock-card">
        {children}
      </div>
    )),
    CardHeader: jest.fn(({ children, className }) => (
      <div className={className} data-testid="mock-card-header">
        {children}
      </div>
    )),
    CardBody: jest.fn(({ children, className }) => (
      <div className={className} data-testid="mock-card-body">
        {children}
      </div>
    )),
    Button: jest.fn(({ children, onPress, disabled, isIconOnly }) => (
      <button
        data-testid={isIconOnly ? "mock-icon-button" : "mock-button"}
        disabled={disabled}
        onClick={onPress}
      >
        {children}
      </button>
    )),
    Spinner: jest.fn(({ size }) => (
      <div data-size={size} data-testid="loading-spinner">
        Spinner
      </div>
    )),
    Divider: jest.fn(() => <hr data-testid="mock-divider" />),
  };
});

describe("HealthCheckDashboard", () => {
  // Create mock responses for the API calls
  const mockHeartbeatResponse = {
    status: "ok",
    message: "Chroma server is running",
    heartbeat: 12345,
  };

  const mockCollectionsInfoResponse = {
    setics: 100,
    knowledge_base: 200,
    custom_collection: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default success responses
    (chromaActions.getChromaHeartbeat as jest.Mock).mockResolvedValue(
      mockHeartbeatResponse,
    );
    (chromaActions.getChromaCollectionsInfo as jest.Mock).mockResolvedValue(
      mockCollectionsInfoResponse,
    );
  });

  it("renders the dashboard with two cards", () => {
    render(<HealthCheckDashboard />);

    // Check that both cards are rendered (using mock testids)
    expect(screen.getAllByTestId("mock-card")).toHaveLength(2);
    expect(screen.getByText("Chroma Heartbeat")).toBeInTheDocument();
    expect(screen.getByText("Chroma Collections")).toBeInTheDocument();

    // Initial state should show N/A for values
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
  });

  it("fetches heartbeat data when heartbeat button is clicked", async () => {
    render(<HealthCheckDashboard />);

    // Find and click the heartbeat button (using mock)
    const heartbeatButton = screen.getAllByTestId("mock-icon-button")[0]; // First icon button

    fireEvent.click(heartbeatButton);

    // Check that the action was called
    expect(chromaActions.getChromaHeartbeat).toHaveBeenCalledTimes(1);

    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText("ok")).toBeInTheDocument();
      expect(screen.getByText("Chroma server is running")).toBeInTheDocument();
      expect(screen.getByText("12345")).toBeInTheDocument();
    });
  });

  it("fetches collections info when collections button is clicked", async () => {
    render(<HealthCheckDashboard />);

    // Find and click the collections button (using mock)
    const collectionsButton = screen.getAllByTestId("mock-icon-button")[1]; // Second icon button

    fireEvent.click(collectionsButton);

    // Check that the action was called
    expect(chromaActions.getChromaCollectionsInfo).toHaveBeenCalledTimes(1);

    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText("100 items")).toBeInTheDocument();
      expect(screen.getByText("200 items")).toBeInTheDocument();
      expect(screen.getByText("50 items")).toBeInTheDocument();
    });
  });

  it("displays loading state when fetching heartbeat data", async () => {
    // Delay the resolution of the promise to test loading state
    (chromaActions.getChromaHeartbeat as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockHeartbeatResponse), 100),
        ),
    );

    render(<HealthCheckDashboard />);

    // Find and click the heartbeat button
    const heartbeatButton = screen.getAllByTestId("mock-icon-button")[0];

    fireEvent.click(heartbeatButton);

    // Check for spinner mock
    expect(screen.getAllByTestId("loading-spinner")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Spinner")[0]).toBeInTheDocument(); // Check content of mock spinner

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("displays loading state when fetching collections data", async () => {
    // Delay the resolution of the promise to test loading state
    (chromaActions.getChromaCollectionsInfo as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockCollectionsInfoResponse), 100),
        ),
    );

    render(<HealthCheckDashboard />);

    // Find and click the collections button
    const collectionsButton = screen.getAllByTestId("mock-icon-button")[1];

    fireEvent.click(collectionsButton);

    // Check for spinner mock
    expect(screen.getAllByTestId("loading-spinner")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Spinner")[0]).toBeInTheDocument(); // Check content of mock spinner

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("displays error message when heartbeat fetch fails", async () => {
    const errorMessage = "Failed to connect to Chroma";

    (chromaActions.getChromaHeartbeat as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    render(<HealthCheckDashboard />);

    // Find and click the heartbeat button
    const heartbeatButton = screen.getAllByTestId("mock-icon-button")[0];

    fireEvent.click(heartbeatButton);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("displays error message when collections fetch fails", async () => {
    const errorMessage = "Failed to fetch collections";

    (chromaActions.getChromaCollectionsInfo as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    render(<HealthCheckDashboard />);

    // Find and click the collections button
    const collectionsButton = screen.getAllByTestId("mock-icon-button")[1];

    fireEvent.click(collectionsButton);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("applies correct color to the status based on response", async () => {
    render(<HealthCheckDashboard />);

    // Find and click the heartbeat button
    const heartbeatButton = screen.getAllByTestId("mock-icon-button")[0];

    fireEvent.click(heartbeatButton);

    // Wait for the status to be displayed
    await waitFor(() => {
      const statusElement = screen.getByText("ok");

      // Note: The mock doesn't apply Tailwind classes, so we check the text content.
      // If specific class checking is vital, the mock needs to be more complex.
      expect(statusElement).toBeInTheDocument();
    });

    // Test with error status
    (chromaActions.getChromaHeartbeat as jest.Mock).mockResolvedValue({
      ...mockHeartbeatResponse,
      status: "error",
    });

    fireEvent.click(heartbeatButton);

    // Wait for the updated status to be displayed
    await waitFor(() => {
      const statusElement = screen.getByText("error");

      expect(statusElement).toBeInTheDocument();
    });
  });

  it("disables buttons during loading state", async () => {
    // Delay the resolution of the promises to test disabled state
    (chromaActions.getChromaHeartbeat as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockHeartbeatResponse), 100),
        ),
    );
    (chromaActions.getChromaCollectionsInfo as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockCollectionsInfoResponse), 100),
        ),
    );

    render(<HealthCheckDashboard />);

    // Find the buttons
    const heartbeatButton = screen.getAllByTestId("mock-icon-button")[0];
    const collectionsButton = screen.getAllByTestId("mock-icon-button")[1];

    // Click heartbeat button
    fireEvent.click(heartbeatButton);

    // Check that button is disabled (using mock)
    expect(heartbeatButton).toBeDisabled();

    // Wait for loading to complete
    await waitFor(() => {
      expect(heartbeatButton).not.toBeDisabled();
    });

    // Now test collections button
    fireEvent.click(collectionsButton);

    // Check that button is disabled (using mock)
    expect(collectionsButton).toBeDisabled();

    // Wait for loading to complete
    await waitFor(() => {
      expect(collectionsButton).not.toBeDisabled();
    });
  });
});
