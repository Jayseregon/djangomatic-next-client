import React from "react";
import { render, screen } from "@testing-library/react";

import QuickbaseInputs from "@/src/components/reports/QuickbaseInputs";
import { TowerReport } from "@/src/interfaces/reports";

describe("QuickbaseInputs", () => {
  const mockHandleChange = jest.fn();
  const mockFormData: Partial<TowerReport> = {
    jde_job: "JOB123",
    client_company: "Test Company",
    client_name: "John Doe",
    job_revision: "Rev1",
    job_description: "Test Job",
    design_standard: "Standard1",
    site_name: "Test Site",
    site_code: "SITE123",
    site_region: "Test Region",
    tower_id: "TWR123",
    tower_name: "Tower1",
    tower_site_name: "Site1",
    assigned_peng: "Engineer1",
    redline_pages: 5,
  };

  const defaultProps = {
    formData: mockFormData,
    handleChange: mockHandleChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields with correct labels", () => {
    render(<QuickbaseInputs {...defaultProps} />);

    const expectedLabels = [
      "Job",
      "Client Company",
      "Client Name",
      "Job Revision",
      "Job Description",
      "Design Standard",
      "Site Name",
      "Site Code",
      "Province",
      "Tower ID",
      "Standard Tower Name",
      "Tower Site Name",
      "Assigned P.Eng",
      "Redline Pages Count",
    ];

    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays form data in input fields", () => {
    render(<QuickbaseInputs {...defaultProps} />);

    Object.entries(mockFormData).forEach(([key, value]) => {
      const input = screen.getByDisplayValue(value.toString());

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("name", key);
    });
  });

  it("renders input fields with correct placeholders", () => {
    render(<QuickbaseInputs {...defaultProps} />);

    const expectedFieldData = [
      { name: "jde_job", placeholder: "XXXXXXX" },
      { name: "client_company", placeholder: "Acme Inc." },
      { name: "client_name", placeholder: "Freddy Mercury" },
      { name: "job_revision", placeholder: "XX", type: "text" },
      { name: "job_description", placeholder: "PCI XXX" },
      { name: "design_standard", placeholder: "CSA XXX" },
      { name: "site_name", placeholder: "Picadilly Circus" },
      { name: "site_code", placeholder: "C0XXXX" },
      { name: "site_region", placeholder: "Westeros" },
      { name: "tower_id", placeholder: "XX-XXXX" },
      { name: "tower_name", placeholder: "LRTXXXX" },
      { name: "tower_site_name", placeholder: "Big Ben" },
      { name: "assigned_peng", placeholder: "Mohammed Ali" },
      { name: "redline_pages", placeholder: "XX", type: "number" },
    ];

    expectedFieldData.forEach(({ name, placeholder, type }) => {
      const inputs = screen.getAllByPlaceholderText(placeholder);
      const matchingInput = inputs.find(
        (input) => input.getAttribute("name") === name,
      );

      expect(matchingInput).toBeInTheDocument();
      expect(matchingInput).toHaveAttribute("name", name);
      if (type) {
        expect(matchingInput).toHaveAttribute("type", type);
      }
    });
  });

  it("renders the redline pages input as number type", () => {
    render(<QuickbaseInputs {...defaultProps} />);

    const redlinePagesInput = screen.getByDisplayValue("5");

    expect(redlinePagesInput).toHaveAttribute("type", "number");
  });

  it("groups inputs in correct sections", () => {
    const { container } = render(<QuickbaseInputs {...defaultProps} />);

    const gridSections = container.getElementsByClassName("grid-cols-3");

    expect(gridSections).toHaveLength(5); // Should have 5 sections with grid-cols-3
  });
});
