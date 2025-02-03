import { renderHook, act } from "@testing-library/react";

import { useLocalImages } from "@/hooks/useLocalImages";
import { TowerReportImage } from "@/interfaces/reports";

describe("useLocalImages", () => {
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

  it("should initialize with empty local images", () => {
    const { result } = renderHook(() => useLocalImages({ images: [] }));

    expect(result.current.localImages).toEqual([]);
  });

  it("should initialize with frontcover label when isFrontcover is true", () => {
    const { result } = renderHook(() =>
      useLocalImages({
        images: mockImages,
        isFrontcover: true,
      }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.localImages[0].label).toBe("Front Cover");
    expect(result.current.localImages[1].label).toBe("Front Cover");
  });

  it("should initialize with original labels when isFrontcover is false", () => {
    const { result } = renderHook(() =>
      useLocalImages({
        images: mockImages,
        isFrontcover: false,
      }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.localImages[0].label).toBe("Test Image 1");
    expect(result.current.localImages[1].label).toBe("Test Image 2");
  });

  it("should find first available index correctly", () => {
    const { result } = renderHook(() => useLocalImages({ images: mockImages }));

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.findFirstAvailableIndex()).toBe(2);
  });

  it("should find first available index with gaps", () => {
    const imagesWithGap = [
      { ...mockImages[0], imgIndex: 0 },
      { ...mockImages[1], imgIndex: 2 },
    ];

    const { result } = renderHook(() =>
      useLocalImages({ images: imagesWithGap }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.findFirstAvailableIndex()).toBe(1);
  });

  it("should sort local images by imgIndex", () => {
    const unsortedImages = [
      { ...mockImages[0], imgIndex: 2 },
      { ...mockImages[1], imgIndex: 1 },
    ];

    const { result } = renderHook(() =>
      useLocalImages({ images: unsortedImages }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.sortedLocalImages[0].imgIndex).toBe(1);
    expect(result.current.sortedLocalImages[1].imgIndex).toBe(2);
  });

  it("should maintain initialization state", () => {
    const { result, rerender } = renderHook(() =>
      useLocalImages({ images: mockImages }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    const initialLocalImages = [...result.current.localImages];

    // Rerender should not reinitialize
    rerender();
    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.localImages).toEqual(initialLocalImages);
  });

  it("should handle direct local images updates", () => {
    const { result } = renderHook(() => useLocalImages({ images: mockImages }));

    act(() => {
      result.current.setLocalImages([
        {
          file: null,
          url: "http://example.com/new.jpg",
          label: "New Image",
          imgIndex: 0,
          deficiency_check_procedure: "",
          deficiency_recommendation: "",
        },
      ]);
    });

    expect(result.current.localImages).toHaveLength(1);
    expect(result.current.localImages[0].label).toBe("New Image");
  });

  it("should handle missing imgIndex in images", () => {
    const imagesWithoutIndex = mockImages.map(
      ({
        id,
        url,
        label,
        deficiency_check_procedure,
        deficiency_recommendation,
        azureId,
      }) => ({
        id,
        url,
        label,
        deficiency_check_procedure,
        deficiency_recommendation,
        azureId,
      }),
    );
    const { result } = renderHook(() =>
      useLocalImages({
        images: imagesWithoutIndex as TowerReportImage[],
      }),
    );

    act(() => {
      result.current.initLocalImages();
    });

    expect(result.current.localImages[0].imgIndex).toBe(0);
    expect(result.current.localImages[1].imgIndex).toBe(1);
  });
});
