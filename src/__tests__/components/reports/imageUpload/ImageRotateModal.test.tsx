import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { ImageRotateModal } from "@/src/components/reports/imageUpload/ImageRotateModal";

// Update canvas mock implementation
const createMockCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = {
    translate: jest.fn(),
    rotate: jest.fn(),
    drawImage: jest.fn(),
    canvas: {
      width: 100,
      height: 100,
    },
  };

  // Improve mock implementation
  canvas.getContext = jest.fn().mockReturnValue(ctx);
  canvas.toBlob = jest.fn().mockImplementation((callback) => {
    const blob = new Blob(["test"], { type: "image/png" });

    callback(blob);
  });

  Object.defineProperties(canvas, {
    width: {
      get: () => 100,
      set: jest.fn(),
      configurable: true,
    },
    height: {
      get: () => 100,
      set: jest.fn(),
      configurable: true,
    },
  });

  return canvas;
};

// Setup before all tests
beforeAll(() => {
  const mockCanvas = createMockCanvas();

  // Properly mock HTMLCanvasElement
  Object.defineProperty(global.HTMLCanvasElement.prototype, "getContext", {
    value: mockCanvas.getContext,
  });
  Object.defineProperty(global.HTMLCanvasElement.prototype, "toBlob", {
    value: mockCanvas.toBlob,
  });

  // Mock Image with proper onload behavior
  global.Image = class {
    onload: () => void = () => {};
    width = 100;
    height = 100;
    src = "";

    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  } as any;
});

describe("ImageRotateModal Component", () => {
  const mockFile = new File(["dummy content"], "test-image.png", {
    type: "image/png",
  });
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    URL.createObjectURL = jest.fn(() => "mock-url");
    URL.revokeObjectURL = jest.fn();
  });

  describe("Rendering", () => {
    it("renders modal when open", () => {
      render(
        <ImageRotateModal
          file={mockFile}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      expect(screen.getByText("Image Rotation")).toBeInTheDocument();
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
      expect(screen.getByLabelText("rotate Left")).toBeInTheDocument();
      expect(screen.getByLabelText("rotate right")).toBeInTheDocument();
      expect(screen.getByLabelText("confirm")).toBeInTheDocument();
      expect(screen.getByLabelText("cancel")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(
        <ImageRotateModal
          file={mockFile}
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      expect(screen.queryByText("Image Rotation")).not.toBeInTheDocument();
    });
  });

  describe("Image Preview", () => {
    it("creates and revokes object URL for preview image", () => {
      const { unmount } = render(
        <ImageRotateModal
          file={mockFile}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);

      unmount();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it("updates preview rotation when rotating image", () => {
      render(
        <ImageRotateModal
          file={mockFile}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      const previewImage = screen.getByAltText("Preview");

      expect(previewImage).toHaveStyle({ transform: "rotate(0deg)" });

      fireEvent.click(screen.getByLabelText("rotate right"));
      expect(previewImage).toHaveStyle({ transform: "rotate(90deg)" });

      fireEvent.click(screen.getByLabelText("rotate Left"));
      expect(previewImage).toHaveStyle({ transform: "rotate(0deg)" });
    });
  });

  describe("Interactions", () => {
    it("calls onClose when cancel button is clicked", () => {
      render(
        <ImageRotateModal
          file={mockFile}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      fireEvent.click(screen.getByLabelText("cancel"));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("processes image rotation and calls onConfirm when save button is clicked", async () => {
      render(
        <ImageRotateModal
          file={mockFile}
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />,
      );

      // Rotate right
      fireEvent.click(screen.getByLabelText("rotate right"));

      // Wait for all promises to resolve
      await act(async () => {
        fireEvent.click(screen.getByLabelText("confirm"));
        // Add small delay to allow for async operations
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockOnConfirm).toHaveBeenCalledWith(expect.any(File));
    });
  });

  describe("Error Handling", () => {
    it("handles canvas context error gracefully", async () => {
      // Mock console.error before doing anything else
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create error canvas that will definitely cause an error
      const errorCanvas = document.createElement("canvas");

      // Mock getContext to return null and throw our expected error
      const mockGetContext = jest.fn(() => {
        console.error("Could not get canvas context");

        return null;
      });

      Object.defineProperty(errorCanvas, "getContext", {
        value: mockGetContext,
        configurable: true,
      });

      // Other required canvas properties
      Object.defineProperties(errorCanvas, {
        width: { get: () => 100, set: jest.fn(), configurable: true },
        height: { get: () => 100, set: jest.fn(), configurable: true },
        toBlob: {
          value: jest.fn((callback) => callback(new Blob())),
          configurable: true,
        },
      });

      // Mock createElement only for canvas
      const originalCreateElement = document.createElement.bind(document);

      document.createElement = jest.fn((tagName) => {
        if (tagName.toLowerCase() === "canvas") {
          return errorCanvas;
        }

        return originalCreateElement(tagName);
      });

      try {
        render(
          <ImageRotateModal
            file={mockFile}
            isOpen={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />,
        );

        await act(async () => {
          fireEvent.click(screen.getByLabelText("confirm"));
          // Allow time for error to be handled
          await new Promise((resolve) => setTimeout(resolve, 100));
        });

        expect(mockOnConfirm).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith("Could not get canvas context");
      } finally {
        // Cleanup
        consoleSpy.mockRestore();
        document.createElement = originalCreateElement;
      }
    });
  });
});
