import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/navigation";

import TowerReportsDashboard from "@/components/reports/TowerReportsDashboard"; // Changed to default import

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Sample tower report data
const mockTowerReports = [
  {
    id: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
    jde_work_order: "WO-123",
    jde_job: "JOB-456",
    site_name: "Test Site",
    site_code: "TS-01",
    tower_id: "TWR-01",
    job_revision: "A",
    job_description: "Test Job",
    design_standard: "Standard A",
    client_company: "Test Company",
    front_image: [],
    site_images: [],
    deficiency_images: [],
  },
];

describe("TowerReportsDashboard", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === "/api/prisma-tower-reports-dashboard") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTowerReports),
        });
      }
      if (url.includes("/api/prisma-tower-report/delete")) {
        return Promise.resolve({ ok: true });
      }
      if (url.includes("/api/prisma-tower-report?id=")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTowerReports[0]),
        });
      }

      return Promise.resolve({ ok: true });
    });
  });

  it("renders dashboard with tower reports", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(screen.getByText("WO-123")).toBeInTheDocument();
    });

    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("JDE WO")).toBeInTheDocument();
    expect(screen.getByText("Site Name")).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(screen.getByText("WO-123")).toBeInTheDocument();
    });

    // Get search input by type="search" instead of role
    const searchInput = screen.getByRole("searchbox", {
      name: "search-bar",
    });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "WO-123" } });
    });

    expect(screen.getByText("WO-123")).toBeInTheDocument();
  });

  it("handles create new report", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    const createButton = screen.getByText("Create New Report");

    fireEvent.click(createButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/reports/new");
  });

  it("handles edit report", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(screen.getByText("WO-123")).toBeInTheDocument();
    });

    const editButton = screen
      .getAllByRole("button")
      .find((button) => button.getAttribute("data-color") === "success");

    expect(editButton).toBeDefined();
    if (editButton) {
      fireEvent.click(editButton);
      expect(mockRouter.push).toHaveBeenCalledWith("/reports/1");
    }
  });

  it("handles delete report when allowed", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(screen.getByText("WO-123")).toBeInTheDocument();
    });

    const deleteButton = screen
      .getAllByRole("button")
      .find((button) => button.innerHTML.includes("Trash2"));

    if (deleteButton) {
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/prisma-tower-report/delete"),
          expect.any(Object),
        );
      });
    }
  });

  it("does not show delete button when not allowed", async () => {
    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={false} />);
    });

    const deleteButtons = screen.queryAllByRole("button");
    const deleteButton = deleteButtons.find((button) =>
      button.innerHTML.includes("Trash2"),
    );

    expect(deleteButton).toBeUndefined();
  });

  it("handles generate PDF", async () => {
    const mockOpen = jest.fn();

    window.open = mockOpen;

    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(screen.getByText("WO-123")).toBeInTheDocument();
    });

    const pdfButton = screen
      .getAllByRole("button")
      .find((button) => button.innerHTML.includes("FileText"));

    if (pdfButton) {
      fireEvent.click(pdfButton);
      expect(mockOpen).toHaveBeenCalledWith("/pdf/rogers/1", "_blank");
    }
  });

  it("handles API error gracefully", async () => {
    console.error = jest.fn();

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    await act(async () => {
      render(<TowerReportsDashboard canDeleteReports={true} />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch tower reports:",
        expect.any(Error),
      );
    });
  });
});
