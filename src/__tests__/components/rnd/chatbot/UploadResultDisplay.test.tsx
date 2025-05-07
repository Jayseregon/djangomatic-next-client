import React from "react";
import { render, screen } from "@testing-library/react";

import { UploadResultDisplay } from "@/components/rnd/chatbot/UploadResultDisplay";
import {
  AddDocumentsResponse,
  UpdateDocumentsResponse,
} from "@/interfaces/chatbot";

describe("UploadResultDisplay", () => {
  // Mock data for AddDocumentsResponse
  const addResult: AddDocumentsResponse = {
    status: "success",
    filename: "test-document.pdf",
    store_metadata: {
      nb_collections: 1,
      details: { collection1: { count: 10 } },
    },
    added_count: 5,
    skipped_count: 2,
    skipped_sources: ["source1", "source2"],
  };

  // Mock data for UpdateDocumentsResponse
  const updateResult: UpdateDocumentsResponse = {
    status: "success",
    filename: "test-document-updated.pdf",
    store_metadata: {
      nb_collections: 1,
      details: { collection1: { count: 10 } },
    },
    added_count: 3,
    docs_replaced: 7,
    sources_updated: 1,
  };

  it("renders nothing when result is null", () => {
    const { container } = render(<UploadResultDisplay result={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders add result data correctly", () => {
    render(<UploadResultDisplay result={addResult} />);

    // Check heading
    expect(screen.getByText("Upload Results:")).toBeInTheDocument();

    // Check document counts
    expect(screen.getByText("Documents Added:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("Documents Skipped:")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // Check filename with default label
    expect(screen.getByText("Filename:")).toBeInTheDocument();
    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();

    // Shouldn't show "Documents Replaced" for add result
    expect(screen.queryByText("Documents Replaced:")).not.toBeInTheDocument();
  });

  it("renders update result data correctly", () => {
    render(<UploadResultDisplay result={updateResult} />);

    // Check heading
    expect(screen.getByText("Upload Results:")).toBeInTheDocument();

    // Check document counts
    expect(screen.getByText("Documents Added:")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    expect(screen.getByText("Documents Replaced:")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    // Check filename with default label
    expect(screen.getByText("Filename:")).toBeInTheDocument();
    expect(screen.getByText("test-document-updated.pdf")).toBeInTheDocument();

    // Shouldn't show "Documents Skipped" for update result
    expect(screen.queryByText("Documents Skipped:")).not.toBeInTheDocument();
  });

  it("uses custom source label when provided", () => {
    render(<UploadResultDisplay result={addResult} sourceLabel="Source URL" />);

    expect(screen.getByText("Source URL:")).toBeInTheDocument();
    expect(screen.queryByText("Filename:")).not.toBeInTheDocument();
    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();
  });

  it("renders with correct styling classes", () => {
    render(<UploadResultDisplay result={addResult} />);

    // Check container has the right classes
    const container = screen.getByText("Upload Results:").closest("div");

    expect(container).toHaveClass(
      "bg-foreground/5",
      "p-3",
      "rounded-md",
      "border",
      "border-foreground/10",
    );

    // Check heading has the right classes
    const heading = screen.getByText("Upload Results:");

    expect(heading).toHaveClass("text-sm", "font-semibold", "mb-1");

    // Check content container has the right classes
    const contentContainer = heading.nextSibling;

    expect(contentContainer).toHaveClass("text-xs", "space-y-1");

    // Check labels have the right class
    const labels = screen.getAllByText(
      /Documents Added:|Documents Skipped:|Filename:/,
    );

    labels.forEach((label) => {
      expect(label).toHaveClass("font-light");
    });

    // Check values have the right class
    const values = [
      screen.getByText("5"),
      screen.getByText("2"),
      screen.getByText("test-document.pdf"),
    ];

    values.forEach((value) => {
      expect(value).toHaveClass("font-bold");
    });
  });
});
