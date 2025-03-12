import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { UserAccessChatbot } from "@/components/chatbot/UserAccess";
import { fetchUserServer } from "@/actions/generic/action";

// Mock the server action
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

// Mock the UnAuthorized component
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized Access</div>,
}));

describe("UserAccessChatbot Component", () => {
  const mockEmail = "test@example.com";
  const mockChildren = <div data-testid="child-content">Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when user has access to chatbot", async () => {
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessChatbot: true,
      rndTasks: [],
      createdAt: new Date(),
      lastLogin: new Date(),
      isAdmin: false,
      isRnDTeam: false,
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
      canAccessRnd: false,
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

    (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <UserAccessChatbot email={mockEmail}>{mockChildren}</UserAccessChatbot>,
    );

    // Component renders children by default while loading
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Wait for the user data to be processed
    await waitFor(() => {
      expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);
    });

    // Verify content is still present after user data is loaded
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("should render UnAuthorized component when user does not have access to chatbot", async () => {
    // Mock successful user fetch without chatbot access
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessChatbot: false,
      rndTasks: [],
      createdAt: new Date(),
      lastLogin: new Date(),
      isAdmin: false,
      isRnDTeam: false,
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
      canAccessRnd: false,
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

    (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <UserAccessChatbot email={mockEmail}>{mockChildren}</UserAccessChatbot>,
    );

    // Wait for the unauthorized component to appear
    await waitFor(() => {
      expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
    });

    // Verify protected content is not rendered
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("should handle error when fetching user data", async () => {
    // Mock failed user fetch
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (fetchUserServer as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch"),
    );

    render(
      <UserAccessChatbot email={mockEmail}>{mockChildren}</UserAccessChatbot>,
    );

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user:",
        expect.any(Error),
      );
    });

    // Children should remain visible when error occurs
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Clean up console spy
    consoleErrorSpy.mockRestore();
  });

  it("should handle null user response", async () => {
    // Mock null user response
    (fetchUserServer as jest.Mock).mockResolvedValueOnce(null);

    render(
      <UserAccessChatbot email={mockEmail}>{mockChildren}</UserAccessChatbot>,
    );

    // Wait for component to process null response
    await waitFor(() => {
      // Should render children when user is null (fallback behavior)
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    // Verify the fetch was called
    expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);
  });
});
