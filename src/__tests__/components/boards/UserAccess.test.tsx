import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserAccessBoards from "@/components/boards/UserAccess";
import { fetchUserServer } from "@/actions/generic/action";

// Mock the server action
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

// Mock the UnAuthorized component
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized Access</div>,
}));

describe("UserAccessBoards Component", () => {
  const mockEmail = "test@example.com";
  const mockChildren = <div data-testid="child-content">Board Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when user has board access", async () => {
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessRoadmapBoard: true,
      canAccessBugReportBoard: false,
      canAccessRnd: false,
      // ...other properties if needed
    };

    (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <UserAccessBoards boardType="canAccessRoadmapBoard" email={mockEmail}>
        {mockChildren}
      </UserAccessBoards>,
    );

    // Initially, children may be rendered during loading
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchUserServer).toHaveBeenCalledWith(mockEmail);
    });

    // User has access, so children remain rendered
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders UnAuthorized when user does not have board access", async () => {
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Test User",
      canAccessRoadmapBoard: false,
      canAccessBugReportBoard: false,
      canAccessRnd: false,
    };

    (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);

    render(
      <UserAccessBoards boardType="canAccessRoadmapBoard" email={mockEmail}>
        {mockChildren}
      </UserAccessBoards>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
    });

    // Children should not be rendered when access is denied
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("handles error when fetching user data", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (fetchUserServer as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch error"),
    );

    render(
      <UserAccessBoards boardType="canAccessRnd" email={mockEmail}>
        {mockChildren}
      </UserAccessBoards>,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("handles null user response by rendering children", async () => {
    (fetchUserServer as jest.Mock).mockResolvedValueOnce(null);

    render(
      <UserAccessBoards boardType="canAccessBugReportBoard" email={mockEmail}>
        {mockChildren}
      </UserAccessBoards>,
    );

    await waitFor(() => {
      // When user is null, fallback to rendering children
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });
  });
});
