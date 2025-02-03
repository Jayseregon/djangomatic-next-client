import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import "@testing-library/jest-dom";
import { VideosGrids } from "@/src/components/docs/VideosGrids";

// Mock fetch
global.fetch = jest.fn();

// Mock video element methods
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

// Mock video blobs data
const mockBlobs = [
  {
    name: "admin/test_video_1.mp4",
    createdOn: new Date(),
    contentType: "video/mp4",
    url: "https://example.com/video1.mp4",
    tags: {
      clientName: "test",
      categoryName: "admin",
      uuid: "123",
    },
  },
  {
    name: "gis/test_video_2.mp4",
    createdOn: new Date(),
    contentType: "video/mp4",
    url: "https://example.com/video2.mp4",
    tags: {
      clientName: "test",
      categoryName: "gis",
      uuid: "456",
    },
  },
];

describe("VideosGrids", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBlobs),
      }),
    );
  });

  it("renders without crashing", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });
    const gridContainer = screen.getByTestId("videos-grid");

    expect(gridContainer).toBeInTheDocument();
  });

  it("fetches and displays videos on mount", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/azure-blob/list?subdir=videos_tutorials",
      expect.any(Object),
    );
  });

  it("displays filtered videos based on category", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    expect(screen.getByText("Test Video 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Video 2")).not.toBeInTheDocument();
  });

  it("handles video selection", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    const videoCard = screen.getByText("Test Video 1").closest("div");

    expect(videoCard).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(videoCard!);
    });

    const videoElement = screen.getByTestId("video-player");

    expect(videoElement).toBeInTheDocument();
    expect(videoElement.querySelector("source")).toHaveAttribute(
      "src",
      "https://example.com/video1.mp4",
    );
  });

  it("handles keyboard navigation", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    const videoCard = screen.getByText("Test Video 1").closest("div");

    expect(videoCard).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(videoCard!, { key: "Enter" });
    });

    const videoElement = screen.getByTestId("video-player");

    expect(videoElement).toBeInTheDocument();
    expect(videoElement.querySelector("source")).toHaveAttribute(
      "src",
      "https://example.com/video1.mp4",
    );
  });

  it("applies correct styling to video cards", async () => {
    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    const videoCard = screen.getByRole("button");

    expect(videoCard).toHaveClass(
      "p-4",
      "border",
      "border-divider",
      "rounded-lg",
      "cursor-pointer",
    );
  });

  it("handles fetch errors gracefully", async () => {
    // Mock console.error before the test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock fetch to reject with an error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    await act(async () => {
      render(<VideosGrids selectedCategory="admin" />);
    });

    // Wait for the error to be logged
    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      },
      { timeout: 1000 },
    );

    // Clean up
    consoleSpy.mockRestore();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
