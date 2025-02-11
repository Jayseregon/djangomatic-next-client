import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";
import { BoardCard } from "@/components/boards/BoardCard";

// Mock next/navigation to provide a push function
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock next-intl to return fixed translation strings
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "title") return "Board Title";
    if (key === "subtitle") return "Board Subtitle";

    return key;
  },
}));

describe("BoardCard Component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders board card with correct translated texts", () => {
    render(<BoardCard href="/test-path" target="test" />);
    expect(screen.getByText("Board Title")).toBeInTheDocument();
    expect(screen.getByText("Board Subtitle")).toBeInTheDocument();
  });

  it("navigates to the specified href on press", async () => {
    render(<BoardCard href="/test-path" target="test" />);
    // Find the card by its title then get its closest clickable container
    const cardContainer = screen.getByText("Board Title").closest("div");

    if (!cardContainer) throw new Error("Card container not found");
    await userEvent.click(cardContainer);
    expect(pushMock).toHaveBeenCalledWith("/test-path");
  });
});
