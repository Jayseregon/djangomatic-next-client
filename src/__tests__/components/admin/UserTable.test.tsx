import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { UserTable } from "@/components/admin/UserTable";
import { UserSchema } from "@/interfaces/lib";

// Mock component dependencies
jest.mock("@/components/ui/LoadingContent", () => ({
  LoadingContent: () => <div data-testid="loading-content">Loading...</div>,
}));

// Mock UserTableBodies component
jest.mock("@/components/admin/UserTableBodies", () => ({
  renderTableBody: (
    user: any,
    menu: string,
    isAdmin: boolean,
    isSuperUser: boolean,
    handleToggle: (id: string, permission: string, newValue: boolean) => void,
  ) => (
    <tr key={user.id} data-testid={`user-row-${user.id}`}>
      <td>{user.name}</td>
      <td>
        <button
          data-testid={`permission-toggle-${user.id}-canAccessReports`}
          disabled={!isSuperUser}
          onClick={() =>
            handleToggle(user.id, "canAccessReports", !user.canAccessReports)
          }
        >
          Toggle
        </button>
      </td>
    </tr>
  ),
}));

// Mock UserTableHeaders component
jest.mock("@/components/admin/UserTableHeaders", () => ({
  renderTableHeader: (selectedMenu: string) => (
    <thead>
      <tr>
        <th>Name</th>
        <th data-testid="permissions-header">
          {selectedMenu === "docs"
            ? "Docs permissions"
            : selectedMenu === "videos"
              ? "Videos permissions"
              : selectedMenu === "apps-tds"
                ? "TDS permissions"
                : "Default permissions"}
        </th>
      </tr>
    </thead>
  ),
}));

// Mock RadioGroup and Radio from @heroui/react
jest.mock("@heroui/react", () => ({
  ...jest.requireActual("@heroui/react"),
  RadioGroup: ({ children, value, onValueChange, label }: any) => (
    <div aria-label={label} role="radiogroup">
      <div className="radio-label">{label}</div>
      <div className="radio-buttons" data-value={value}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange(child.props.value),
          }),
        )}
      </div>
    </div>
  ),
  Radio: ({ value, children, checked, onChange }: any) => (
    <button
      aria-checked={checked}
      role="radio"
      value={value}
      onClick={onChange}
    >
      {children}
    </button>
  ),
  TableBody: ({
    children,
    items = [],
    emptyContent,
    isLoading,
    loadingContent,
  }: any) => {
    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan={2}>{loadingContent}</td>
          </tr>
        </tbody>
      );
    }
    if (!items?.length) {
      return (
        <tbody>
          <tr>
            <td colSpan={2}>{emptyContent}</td>
          </tr>
        </tbody>
      );
    }

    return <tbody>{items.map((item: any) => children(item))}</tbody>;
  },
}));

describe("UserTable Component", () => {
  const mockUsers: UserSchema[] = [
    {
      id: "1",
      email: "regular@test.com",
      name: "Regular User",
      isAdmin: false,
      canAccessReports: true,
      canDeleteReports: false,
      createdAt: new Date(),
      lastLogin: new Date(),
      isRnDTeam: false,
    } as UserSchema,
    {
      id: "2",
      email: "admin@test.com",
      name: "Admin User",
      isAdmin: true,
      canAccessReports: true,
      canDeleteReports: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      isRnDTeam: false,
    } as UserSchema,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders regular users table correctly", async () => {
    const mockData = mockUsers.filter((u) => !u.isAdmin);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(<UserTable sessionEmail="admin@example.com" />);

    // Wait for loading to complete and data to be rendered
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-row-1")).toBeInTheDocument();
      expect(screen.getByText("Regular User")).toBeInTheDocument();
    });

    expect(screen.queryByText("Admin User")).not.toBeInTheDocument();
  });

  it("renders admin users table correctly", async () => {
    const mockData = mockUsers.filter((u) => u.isAdmin);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(<UserTable isAdmin={true} sessionEmail="admin@example.com" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    // Wait for data to render
    await waitFor(() => {
      expect(screen.getByTestId("user-row-2")).toBeInTheDocument();
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });

    expect(screen.queryByText("Regular User")).not.toBeInTheDocument();
  });

  it("handles menu switching", async () => {
    const mockData = mockUsers.filter((u) => !u.isAdmin);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(<UserTable sessionEmail="admin@example.com" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    // Click radio buttons using role and name
    const docsRadio = screen.getByRole("radio", { name: "Docs" });

    await userEvent.click(docsRadio);

    await waitFor(() => {
      expect(screen.getByTestId("permissions-header")).toHaveTextContent(
        "Docs permissions",
      );
    });

    const tdsRadio = screen.getByRole("radio", { name: "TDS" });

    await userEvent.click(tdsRadio);

    await waitFor(() => {
      expect(screen.getByTestId("permissions-header")).toHaveTextContent(
        "TDS permissions",
      );
    });
  });

  it("handles permission toggling", async () => {
    const mockFetch = jest.fn().mockImplementation((url) => {
      if (url === "/api/prisma-user") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers.filter((u) => !u.isAdmin)),
        });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    global.fetch = mockFetch;

    render(<UserTable sessionEmail="jayseregon@gmail.com" />);

    // Wait for loading to complete and data to be rendered
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("permission-toggle-1-canAccessReports"),
      ).toBeInTheDocument();
    });

    const toggleButton = screen.getByTestId(
      "permission-toggle-1-canAccessReports",
    );

    await userEvent.click(toggleButton);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/prisma-user/update",
      expect.objectContaining({
        method: "PATCH",
        body: expect.stringContaining("canAccessReports"),
      }),
    );
  });

  it("shows loading state", async () => {
    // Delay the fetch response
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<UserTable sessionEmail="admin@example.com" />);

    await waitFor(
      () => {
        expect(screen.getByTestId("loading-content")).toBeInTheDocument();
      },
      { timeout: 50 },
    );
  });

  it("handles fetch error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock a failed response instead of rejecting the promise
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    render(<UserTable sessionEmail="admin@example.com" />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch users:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("respects super user permissions", async () => {
    const mockData = mockUsers.filter((u) => !u.isAdmin);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { rerender } = render(
      <UserTable sessionEmail="jayseregon@gmail.com" />,
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    // Verify super user can access controls
    const superUserToggle = screen.getByTestId(
      "permission-toggle-1-canAccessReports",
    );

    expect(superUserToggle).toBeEnabled();

    // Mock data for non-super user
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    // Re-render with non-super user
    rerender(<UserTable sessionEmail="regular@test.com" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
    });

    // Verify non-super user has disabled controls
    const regularUserToggle = screen.getByTestId(
      "permission-toggle-1-canAccessReports",
    );

    expect(regularUserToggle).toHaveAttribute("disabled");
  });
});
