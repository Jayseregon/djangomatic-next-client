import React from "react";
import { render, screen } from "@testing-library/react";

import { DashboardManager } from "@/src/components/reports/DashboardManager";

// Mock child components
jest.mock("@/src/components/reports/UserAccess", () => {
  const UserAccessMock = ({
    children,
    email,
    setCanDeleteReports,
  }: {
    children: React.ReactNode;
    email: string;
    setCanDeleteReports: (value: boolean) => void;
  }) => {
    React.useEffect(() => {
      setCanDeleteReports(email === "admin@example.com");
    }, [email, setCanDeleteReports]);

    return <div data-testid="user-access">{children}</div>;
  };

  return {
    __esModule: true,
    default: UserAccessMock,
  };
});

jest.mock("@/src/components/reports/TowerReportsDashboard", () => ({
  TowerReportsDashboard: ({
    canDeleteReports,
  }: {
    canDeleteReports: boolean;
  }) => (
    <div data-testid="tower-reports-dashboard">
      Dashboard {canDeleteReports ? "Can Delete" : "Cannot Delete"}
    </div>
  ),
}));

describe("DashboardManager", () => {
  it("renders the component with title", () => {
    render(<DashboardManager email="user@example.com" />);

    expect(screen.getByText("PCI Reports")).toBeInTheDocument();
    expect(screen.getByTestId("user-access")).toBeInTheDocument();
    expect(screen.getByTestId("tower-reports-dashboard")).toBeInTheDocument();
  });

  it("passes canDeleteReports state to TowerReportsDashboard - regular user", () => {
    render(<DashboardManager email="user@example.com" />);

    expect(screen.getByText("Dashboard Cannot Delete")).toBeInTheDocument();
  });

  it("passes canDeleteReports state to TowerReportsDashboard - admin user", () => {
    render(<DashboardManager email="admin@example.com" />);

    expect(screen.getByText("Dashboard Can Delete")).toBeInTheDocument();
  });

  it("maintains correct component hierarchy", () => {
    render(<DashboardManager email="user@example.com" />);

    const userAccess = screen.getByTestId("user-access");
    const dashboard = screen.getByTestId("tower-reports-dashboard");

    expect(userAccess).toContainElement(dashboard);
  });
});
