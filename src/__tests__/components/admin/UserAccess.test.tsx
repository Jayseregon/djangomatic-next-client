import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { UserAccessAdmin } from "@/components/admin/UserAccess";
import { fetchUserServer } from "@/actions/generic/action";

// Mock the server action
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

// Mock the components
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized Access</div>,
}));

jest.mock("@/components/admin/UserTable", () => ({
  UserTable: ({
    isAdmin,
    sessionEmail,
  }: {
    isAdmin?: boolean;
    sessionEmail: string;
  }) => (
    <div data-testid={isAdmin ? "super-user-table" : "user-table"}>
      Mock User Table {sessionEmail}
    </div>
  ),
}));

jest.mock("@/components/admin/BlobStorage", () => ({
  BlobStorage: () => <div data-testid="blob-storage">Mock Blob Storage</div>,
}));

describe("UserAccessAdmin Component", () => {
  const mockEmail = "admin@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  const setupFetchMocks = (adminUser: boolean, usersList: any[] = []) => {
    // Mock the initial user fetch
    (fetchUserServer as jest.Mock).mockResolvedValueOnce({
      id: "1",
      email: mockEmail,
      name: adminUser ? "Admin User" : "Regular User",
      isAdmin: adminUser,
    });

    // Mock the users list fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(usersList),
      }),
    );
  };

  it("should render admin tabs when user is admin", async () => {
    const mockUsers = [
      { id: "1", name: "User 1", isAdmin: false },
      { id: "2", name: "User 2", isAdmin: false },
      { id: "3", name: "Admin 1", isAdmin: true },
    ];

    setupFetchMocks(true, mockUsers);

    render(<UserAccessAdmin email={mockEmail} />);

    // Wait for the component to fully render and update
    await waitFor(() => {
      expect(screen.getByLabelText("admin-tabs")).toBeInTheDocument();
    });

    // Wait for the user count to update and check tab content
    await waitFor(() => {
      const userTab = screen.getByTestId("tab-User Permissions (2)");
      const superUserTab = screen.getByTestId("tab-Superuser Permissions (1)");
      const blobTab = screen.getByTestId("tab-Azure Blobs Storage");

      expect(userTab).toBeInTheDocument();
      expect(superUserTab).toBeInTheDocument();
      expect(blobTab).toBeInTheDocument();
    });
  });

  it("should render UnAuthorized component when user is not admin", async () => {
    setupFetchMocks(false);

    render(<UserAccessAdmin email={mockEmail} />);

    await waitFor(() => {
      expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("admin-tabs")).not.toBeInTheDocument();
  });

  it("should switch between tabs", async () => {
    const mockUsers = [
      { id: "1", name: "User 1", isAdmin: false },
      { id: "2", name: "Admin 1", isAdmin: true },
    ];

    setupFetchMocks(true, mockUsers);

    render(<UserAccessAdmin email={mockEmail} />);

    await waitFor(() => {
      expect(
        screen.getByTestId("tab-User Permissions (1)"),
      ).toBeInTheDocument();
    });

    // Click tabs using testId instead of text content
    await userEvent.click(screen.getByTestId("tab-Superuser Permissions (1)"));
    expect(screen.getByTestId("super-user-table")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("tab-Azure Blobs Storage"));
    expect(screen.getByTestId("blob-storage")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("tab-User Permissions (1)"));
    expect(screen.getByTestId("user-table")).toBeInTheDocument();
  });

  it("should handle error when fetching users list", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock admin user fetch success but users list fetch failure
    (fetchUserServer as jest.Mock).mockResolvedValueOnce({
      id: "1",
      email: mockEmail,
      name: "Admin User",
      isAdmin: true,
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch users"),
    );

    render(<UserAccessAdmin email={mockEmail} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch users:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should handle error when fetching user data", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (fetchUserServer as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch"),
    );

    render(<UserAccessAdmin email={mockEmail} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should fetch and update users count", async () => {
    const mockUser = {
      id: "1",
      email: mockEmail,
      name: "Admin User",
      isAdmin: true,
      // ...other user properties...
    };

    const mockUsers = [
      { ...mockUser },
      { id: "2", name: "Regular User 1", isAdmin: false },
      { id: "3", name: "Regular User 2", isAdmin: false },
      { id: "4", name: "Super User 1", isAdmin: true },
    ];

    (fetchUserServer as jest.Mock).mockResolvedValueOnce(mockUser);
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(mockUsers),
    });

    render(<UserAccessAdmin email={mockEmail} />);

    await waitFor(() => {
      expect(screen.getByText("User Permissions (2)")).toBeInTheDocument();
      expect(screen.getByText("Superuser Permissions (2)")).toBeInTheDocument();
    });
  });
});
