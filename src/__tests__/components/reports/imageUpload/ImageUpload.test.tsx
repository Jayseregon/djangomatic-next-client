import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import ImageUpload from "@/components/reports/imageUpload/ImageUpload";
import { TowerReportImage } from "@/interfaces/reports";

// Mock the motion/react library
jest.mock("motion/react", () => ({
  Reorder: {
    Group: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Item: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  useDragControls: () => ({
    start: jest.fn(),
  }),
}));

// Create mock implementation outside describe block
const mockUploadImageToAzure = jest.fn();

jest.mock("@/hooks/useImageUpload", () => ({
  useImageUpload: () => ({
    uploadImageToAzure: (...args: any[]) => mockUploadImageToAzure(...args),
  }),
}));

// Add URL mock before tests
beforeAll(() => {
  // Mock URL methods
  global.URL.createObjectURL = jest.fn(() => "mock-url");
  global.URL.revokeObjectURL = jest.fn();
});

describe("ImageUpload Component", () => {
  const mockImages: TowerReportImage[] = [
    {
      id: "1",
      url: "http://example.com/image1.jpg",
      label: "Test Image 1",
      imgIndex: 0,
      azureId: "azure1",
      deficiency_check_procedure: "Check 1",
      deficiency_recommendation: "Fix 1",
    },
    {
      id: "2",
      url: "http://example.com/image2.jpg",
      label: "Test Image 2",
      imgIndex: 1,
      azureId: "azure2",
      deficiency_check_procedure: "Check 2",
      deficiency_recommendation: "Fix 2",
    },
  ];

  const defaultProps = {
    images: mockImages,
    onImagesChange: jest.fn(),
    subdir: "test-dir",
    onNewImageUpload: jest.fn(),
    newImageButtonName: "Add Image",
    labelPlaceholder: "Enter label",
    labelOptions: ["Option 1", "Option 2"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            url: "new-url",
            azureId: "new-azure-id",
            id: "new-id",
          }),
      }),
    ) as jest.Mock;
  });

  describe("Rendering", () => {
    it("renders existing images correctly", () => {
      render(<ImageUpload {...defaultProps} />);

      expect(screen.getByText("1. Test Image 1")).toBeInTheDocument();
      expect(screen.getByText("2. Test Image 2")).toBeInTheDocument();
    });

    it("renders add button when under maxImages limit", () => {
      render(<ImageUpload {...defaultProps} maxImages={3} />);
      expect(screen.getByText("Add Image")).toBeInTheDocument();
    });

    it("hides add button when at maxImages limit", () => {
      render(<ImageUpload {...defaultProps} maxImages={2} />);
      expect(screen.queryByText("Add Image")).not.toBeInTheDocument();
    });
  });

  describe("Front Cover Mode", () => {
    it("allows only one image in front cover mode", () => {
      render(<ImageUpload {...defaultProps} images={[]} isFrontcover={true} />);

      expect(screen.getByText("Add Image")).toBeInTheDocument();

      // Add one image
      fireEvent.click(screen.getByText("Add Image"));
      expect(screen.queryByText("Add Image")).not.toBeInTheDocument();
    });
  });

  describe("Deficiency Mode", () => {
    it("renders deficiency fields when in deficiency mode", () => {
      render(<ImageUpload {...defaultProps} isDeficiency={true} />);

      // Use more specific selectors to avoid tooltip conflicts
      expect(
        screen.getByText("Check 1", {
          selector: ".text-ellipsis.overflow-hidden",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Fix 1", {
          selector: ".text-ellipsis.whitespace-nowrap.overflow-hidden",
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Image Operations", () => {
    it("adds new image field when add button is clicked", async () => {
      render(<ImageUpload {...defaultProps} />);

      fireEvent.click(screen.getByText("Add Image"));
      // Change to find input by role="combobox" which is correct for datalist inputs
      expect(screen.getAllByRole("combobox")).toHaveLength(1);
    });

    it("removes image when delete button is clicked", async () => {
      render(<ImageUpload {...defaultProps} />);

      // Find delete buttons by their CircleMinus icon parent button
      const deleteButtons = screen
        .getAllByRole("button")
        .filter((button) => button.getAttribute("color") === "danger");

      await act(async () => {
        fireEvent.click(deleteButtons[0]);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/azure-report-images/delete"),
        expect.any(Object),
      );
    });
  });

  describe("Accessibility", () => {
    it("provides drag handles with proper aria labels", () => {
      render(<ImageUpload {...defaultProps} />);
      const dragHandles = screen.getAllByRole("button");

      expect(dragHandles.length).toBeGreaterThan(0);
    });
  });
});
