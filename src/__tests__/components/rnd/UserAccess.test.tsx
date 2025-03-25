import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  UserAccessRnDBoard,
  UserAccessRnDSection,
  UserAccessRnDLayout,
} from "@/components/rnd/UserAccess";
import { fetchUserServer } from "@/actions/generic/action";
import { getRndUsers } from "@/src/actions/prisma/rndTask/action";
import { UserSchema } from "@/interfaces/lib";

// Mock the server actions
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

jest.mock("@/src/actions/prisma/rndTask/action", () => ({
  getRndUsers: jest.fn(),
}));

// Mock the UnAuthorized component
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized Access</div>,
}));

// Mock the TaskManager component
jest.mock("@/components/rnd/TaskManager", () => ({
  TaskManager: ({ user }: { user: UserSchema }) => (
    <div data-testid="task-manager">Task Manager for {user.name}</div>
  ),
}));

describe("UserAccessRnD Components", () => {
  const mockEmail = "test@example.com";
  const mockChildren = <div data-testid="child-content">Protected Content</div>;
  const mockChildrenPerms = (
    <div data-testid="perms-content">Permissions Content</div>
  );
  const mockChildrenNoPerms = (
    <div data-testid="no-perms-content">No Permissions Content</div>
  );

  // Sample user data
  const mockUser: UserSchema = {
    id: "user1",
    name: "Test User",
    email: mockEmail,
    isAdmin: false,
    isRnDTeam: true,
    canAccessRnd: true,
    createdAt: new Date(),
    lastLogin: new Date(),
    rndTasks: [],
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

  const mockUserNoAccess = {
    ...mockUser,
    canAccessRnd: false,
  };

  // Mock RnD users data
  const mockRndUsers = [
    mockUser,
    {
      ...mockUser,
      id: "user2",
      name: "Another User",
      email: "another@example.com",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UserAccessRnDBoard", () => {
    it("renders task boards when user has RnD access", async () => {
      // Mock successful user fetch with RnD access
      (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);
      (getRndUsers as jest.Mock).mockResolvedValueOnce(mockRndUsers);

      render(<UserAccessRnDBoard email={mockEmail} />);

      // Wait for the user data to be fetched and processed
      await waitFor(() => {
        expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);
      });

      // Wait for the RnD users to be fetched
      await waitFor(() => {
        expect(getRndUsers).toHaveBeenCalled();
      });

      // Should render task managers for each user
      expect(screen.getAllByTestId("task-manager").length).toBe(2);
      expect(
        screen.getByText("Task Manager for Test User"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Task Manager for Another User"),
      ).toBeInTheDocument();
    });

    it("renders unauthorized component when user does not have RnD access", async () => {
      // Mock successful user fetch without RnD access
      (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUserNoAccess);
      (getRndUsers as jest.Mock).mockResolvedValueOnce([]); // Add mock response for getRndUsers

      render(<UserAccessRnDBoard email={mockEmail} />);

      // Wait for the unauthorized component to appear
      await waitFor(() => {
        expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
      });

      // The component calls getRndUsers regardless of permission, so don't check if it was called
      // Just verify that unauthorized component is shown and no task managers are rendered
      expect(screen.queryByTestId("task-manager")).not.toBeInTheDocument();
    });

    it("handles error when fetching user data", async () => {
      // Mock console.error to prevent test output noise
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // Mock failed user fetch
      (fetchUserServer as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch"),
      );

      render(<UserAccessRnDBoard email={mockEmail} />);

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
  });

  describe("UserAccessRnDSection", () => {
    it("renders children when user has RnD access", async () => {
      // Mock successful user fetch with RnD access
      (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);

      render(
        <UserAccessRnDSection email={mockEmail}>
          {mockChildren}
        </UserAccessRnDSection>,
      );

      // Component renders children by default while loading
      expect(screen.getByTestId("child-content")).toBeInTheDocument();

      // Wait for the user data to be fetched and processed
      await waitFor(() => {
        expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);
      });

      // Verify content is still present after user data is loaded
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    it("renders unauthorized component when user does not have RnD access", async () => {
      // Mock successful user fetch without RnD access
      (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUserNoAccess);

      render(
        <UserAccessRnDSection email={mockEmail}>
          {mockChildren}
        </UserAccessRnDSection>,
      );

      // Wait for the unauthorized component to appear
      await waitFor(() => {
        expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
      });

      // Verify children content is not rendered
      expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
    });

    it("handles error when fetching user data", async () => {
      // Mock console.error to prevent test output noise
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // Mock failed user fetch
      (fetchUserServer as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch"),
      );

      render(
        <UserAccessRnDSection email={mockEmail}>
          {mockChildren}
        </UserAccessRnDSection>,
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
  });

  describe("UserAccessRnDLayout", () => {
    it("renders childrenPerms when user has RnD access", () => {
      render(
        <UserAccessRnDLayout
          childrenNoPerms={mockChildrenNoPerms}
          childrenPerms={mockChildrenPerms}
          user={mockUser}
        />,
      );

      // Should render permissions content
      expect(screen.getByTestId("perms-content")).toBeInTheDocument();

      // Should not render no-permissions content
      expect(screen.queryByTestId("no-perms-content")).not.toBeInTheDocument();
    });

    it("renders childrenNoPerms when user does not have RnD access", () => {
      render(
        <UserAccessRnDLayout
          childrenNoPerms={mockChildrenNoPerms}
          childrenPerms={mockChildrenPerms}
          user={mockUserNoAccess}
        />,
      );

      // Should render no-permissions content
      expect(screen.getByTestId("no-perms-content")).toBeInTheDocument();

      // Should not render permissions content
      expect(screen.queryByTestId("perms-content")).not.toBeInTheDocument();
    });
  });
});
