import type { LocalImages } from "@/interfaces/reports";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { ImageRow } from "@/components/reports/imageUpload/ImageRow";

describe("ImageRow Component", () => {
  const mockRemoveImageField = jest.fn();

  const createMockImage = (overrides?: Partial<LocalImages>): LocalImages => ({
    file: null,
    label: "Test Image",
    url: "http://example.com/test.jpg",
    imgIndex: 0,
    deficiency_check_procedure: "Check procedure",
    deficiency_recommendation: "Fix recommendation",
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Front Cover Image", () => {
    it("renders front cover image with minimal controls", () => {
      const mockImage = createMockImage();

      render(
        <ImageRow
          image={mockImage}
          isDeficiency={false}
          isFrontcover={true}
          removeImageField={mockRemoveImageField}
        />,
      );

      expect(screen.getByAltText("Test Image")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();

      // Should not show label input for front cover
      expect(screen.queryByText("1. Test Image")).not.toBeInTheDocument();
    });
  });

  describe("Deficiency Image", () => {
    it("renders deficiency image with all fields", () => {
      const mockImage = createMockImage();

      render(
        <ImageRow
          image={mockImage}
          isDeficiency={true}
          isFrontcover={false}
          removeImageField={mockRemoveImageField}
        />,
      );

      expect(screen.getByAltText("Test Image")).toBeInTheDocument();
      expect(
        screen.getByText("1. Test Image", {
          selector: ".text-ellipsis.whitespace-nowrap",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Check procedure", { selector: ".text-ellipsis" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Fix recommendation", {
          selector: ".text-ellipsis.whitespace-nowrap",
        }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Regular Site Image", () => {
    it("renders site image with label", () => {
      const mockImage = createMockImage();

      render(
        <ImageRow
          image={mockImage}
          isDeficiency={false}
          isFrontcover={false}
          removeImageField={mockRemoveImageField}
        />,
      );

      expect(screen.getByAltText("Test Image")).toBeInTheDocument();
      // Update this test to be more specific as well
      expect(
        screen.getByText("1. Test Image", { selector: ".text-ellipsis" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();

      // Should not show deficiency fields
      expect(screen.queryByText("Check procedure")).not.toBeInTheDocument();
      expect(screen.queryByText("Fix recommendation")).not.toBeInTheDocument();
    });
  });

  describe("Remove Functionality", () => {
    it("calls removeImageField with correct index when trash button is clicked", () => {
      const mockImage = createMockImage({ imgIndex: 3 });

      render(
        <ImageRow
          image={mockImage}
          isDeficiency={false}
          isFrontcover={false}
          removeImageField={mockRemoveImageField}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(mockRemoveImageField).toHaveBeenCalledWith(3);
    });
  });

  describe("Empty State", () => {
    it("renders nothing when no URL is provided", () => {
      const mockImage = createMockImage({ url: undefined });

      const { container } = render(
        <ImageRow
          image={mockImage}
          isDeficiency={false}
          isFrontcover={false}
          removeImageField={mockRemoveImageField}
        />,
      );

      expect(container.firstChild?.childNodes.length).toBe(0);
    });
  });

  describe("Accessibility", () => {
    it("provides accessible image elements", () => {
      const mockImage = createMockImage();

      render(
        <ImageRow
          image={mockImage}
          isDeficiency={true}
          isFrontcover={false}
          removeImageField={mockRemoveImageField}
        />,
      );

      const img = screen.getByAltText("Test Image");

      expect(img).toHaveAttribute("alt", "Test Image");
      expect(img).toHaveAttribute("src", "http://example.com/test.jpg");
    });
  });
});
