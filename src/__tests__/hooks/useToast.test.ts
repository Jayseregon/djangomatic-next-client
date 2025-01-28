import { renderHook, act } from "@testing-library/react";

import { useToast } from "@/hooks/useToast";
import { ToastResponse } from "@/components/ui/ToastNotification";

describe("useToast", () => {
  let localStorageMock: { [key: string]: string } = {};

  beforeEach(() => {
    localStorageMock = {};
    jest.useFakeTimers();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => localStorageMock[key]),
        setItem: jest.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete localStorageMock[key];
        }),
      },
      writable: true,
    });

    // Mock console.error to avoid noise in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toastOpen).toBe(false);
    expect(result.current.toastMessage).toEqual({
      message: "",
      id: "",
      updatedAt: expect.any(Date),
    });
  });

  it("should set toast message and open state", () => {
    const { result } = renderHook(() => useToast());
    const newMessage: ToastResponse = {
      message: "Test message",
      id: "123",
      updatedAt: new Date(),
    };

    act(() => {
      result.current.setToastMessage(newMessage);
      result.current.setToastOpen(true);
    });

    expect(result.current.toastMessage).toEqual(newMessage);
    expect(result.current.toastOpen).toBe(true);
  });

  it("should load notification from localStorage on mount", () => {
    const date = new Date();
    const storedNotification: ToastResponse = {
      message: "Stored message",
      id: "456",
      updatedAt: date,
    };

    localStorageMock["reportNotification"] = JSON.stringify({
      ...storedNotification,
      updatedAt: date.toISOString(), // Store as ISO string as it would be in real storage
    });

    const { result } = renderHook(() => useToast());

    // Fast-forward timers to trigger the setTimeout
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.toastMessage).toEqual(storedNotification);
    expect(result.current.toastOpen).toBe(true);
  });

  it("should remove notification from localStorage after loading", () => {
    const storedNotification: ToastResponse = {
      message: "To be removed",
      id: "789",
      updatedAt: new Date(),
    };

    localStorageMock["reportNotification"] = JSON.stringify(storedNotification);

    renderHook(() => useToast());

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("reportNotification");
  });

  it("should not show toast if no notification in localStorage", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.toastOpen).toBe(false);
    expect(result.current.toastMessage).toEqual({
      message: "",
      id: "",
      updatedAt: expect.any(Date),
    });
  });

  it("should handle malformed JSON in localStorage", () => {
    localStorageMock["reportNotification"] = "invalid-json";

    const { result } = renderHook(() => useToast());

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should maintain default state when JSON parsing fails
    expect(result.current.toastOpen).toBe(false);
    expect(result.current.toastMessage).toEqual({
      message: "",
      id: "",
      updatedAt: expect.any(Date),
    });
    expect(console.error).toHaveBeenCalled();
  });
});
