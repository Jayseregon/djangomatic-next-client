import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserAccessReports from "@/components/reports/UserAccess";
import { fetchUserServer } from "@/actions/generic/action";

// Mock the server action
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

// Mock the UnAuthorized component
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized Access</div>,
}));

describe("UserAccessReports Component", () => {
  const mockSetCanDeleteReports = jest.fn();
  const mockEmail = "test@example.com";
  const mockChildren = <div data-testid="child-content">Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when user has access to reports", async () => {
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessReports: true,
      canDeleteReports: true,
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
      <UserAccessReports
        email={mockEmail}
        setCanDeleteReports={mockSetCanDeleteReports}
      >
        {mockChildren}
      </UserAccessReports>,
    );

    // Component renders children by default while loading
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Wait for the user data to be processed
    await waitFor(() => {
      expect(mockSetCanDeleteReports).toHaveBeenCalledWith(true);
    });

    // Verify server action was called
    expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);

    // Verify content is still present after user data is loaded
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("should render UnAuthorized component when user does not have access to reports", async () => {
    // Mock successful user fetch without reports access
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessReports: false,
      canDeleteReports: false,
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
      <UserAccessReports
        email={mockEmail}
        setCanDeleteReports={mockSetCanDeleteReports}
      >
        {mockChildren}
      </UserAccessReports>,
    );

    // Wait for the unauthorized component to appear
    await waitFor(() => {
      expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
    });

    // Verify protected content is not rendered
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    // Verify setCanDeleteReports was called with correct value
    expect(mockSetCanDeleteReports).toHaveBeenCalledWith(false);
  });

  it("should handle error when fetching user data", async () => {
    // Mock failed user fetch
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (fetchUserServer as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch"),
    );

    render(
      <UserAccessReports
        email={mockEmail}
        setCanDeleteReports={mockSetCanDeleteReports}
      >
        {mockChildren}
      </UserAccessReports>,
    );

    // Wait for the error to be logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user:",
        expect.any(Error),
      );
    });

    // Clean up console spy
    consoleErrorSpy.mockRestore();
  });

  it("should handle null user response", async () => {
    // Mock null user response
    (fetchUserServer as jest.Mock).mockResolvedValueOnce(null);

    render(
      <UserAccessReports
        email={mockEmail}
        setCanDeleteReports={mockSetCanDeleteReports}
      >
        {mockChildren}
      </UserAccessReports>,
    );

    // Wait for component to process null response
    await waitFor(() => {
      // Should render children when user is null (fallback behavior)
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    // Verify setCanDeleteReports was not called
    expect(mockSetCanDeleteReports).not.toHaveBeenCalled();
  });
});
