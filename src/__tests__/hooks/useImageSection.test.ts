import { renderHook, act } from "@testing-library/react";

import { useImageSection } from "@/hooks/useImageSection";
import { TowerReportImage } from "@/interfaces/reports";

describe("useImageSection", () => {
  const mockImages: TowerReportImage[] = [
    {
      id: "1",
      url: "http://example.com/image1.jpg",
      label: "Test Image 1",
      deficiency_check_procedure: "Check 1",
      deficiency_recommendation: "Fix 1",
      imgIndex: 0,
      azureId: "azure1",
    },
    {
      id: "2",
      url: "http://example.com/image2.jpg",
      label: "Test Image 2",
      deficiency_check_procedure: "Check 2",
      deficiency_recommendation: "Fix 2",
      imgIndex: 1,
      azureId: "azure2",
    },
  ];

  it("should initialize with empty arrays when no initial images provided", () => {
    const { result } = renderHook(() => useImageSection());

    expect(result.current.images).toEqual([]);
    expect(result.current.newlyUploadedImages).toEqual([]);
  });

  it("should initialize with provided initial images", () => {
    const { result } = renderHook(() => useImageSection(mockImages));

    expect(result.current.images).toEqual(mockImages);
  });

  it("should handle images change correctly", () => {
    const { result } = renderHook(() => useImageSection(mockImages));
    const newImages = [
      ...mockImages,
      {
        id: "3",
        url: "http://example.com/image3.jpg",
        label: "Test Image 3",
        deficiency_check_procedure: "Check 3",
        deficiency_recommendation: "Fix 3",
        imgIndex: 2,
        azureId: "azure3",
      },
    ];

    act(() => {
      result.current.handleImagesChange(newImages);
    });

    expect(result.current.images).toEqual(newImages);
  });

  it("should handle new image upload correctly", () => {
    const { result } = renderHook(() => useImageSection());
    const newImage: TowerReportImage = {
      id: "new1",
      url: "http://example.com/new1.jpg",
      label: "New Test Image",
      deficiency_check_procedure: "New Check",
      deficiency_recommendation: "New Fix",
      imgIndex: 0,
      azureId: "azureNew1",
    };

    act(() => {
      result.current.handleNewImageUpload(newImage);
    });

    expect(result.current.newlyUploadedImages).toEqual([newImage]);
  });

  it("should accumulate newly uploaded images", () => {
    const { result } = renderHook(() => useImageSection());
    const newImages = mockImages.map((img) => ({
      ...img,
      id: `new-${img.id}`,
    }));

    act(() => {
      newImages.forEach((img) => {
        result.current.handleNewImageUpload(img);
      });
    });

    expect(result.current.newlyUploadedImages).toHaveLength(2);
    expect(result.current.newlyUploadedImages).toEqual(newImages);
  });

  it("should reset newly uploaded images", () => {
    const { result } = renderHook(() => useImageSection());

    act(() => {
      result.current.handleNewImageUpload(mockImages[0]);
      result.current.resetNewlyUploaded();
    });

    expect(result.current.newlyUploadedImages).toEqual([]);
  });

  it("should handle direct image updates using setImages", () => {
    const { result } = renderHook(() => useImageSection());

    act(() => {
      result.current.setImages(mockImages);
    });

    expect(result.current.images).toEqual(mockImages);
  });

  it("should maintain separation between images and newly uploaded images", () => {
    const { result } = renderHook(() => useImageSection(mockImages));
    const newImage = { ...mockImages[0], id: "new-1" };

    act(() => {
      result.current.handleNewImageUpload(newImage);
    });

    expect(result.current.images).toEqual(mockImages);
    expect(result.current.newlyUploadedImages).toEqual([newImage]);
  });
});
