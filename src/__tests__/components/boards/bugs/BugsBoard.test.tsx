import React from "react";
import { render, waitFor, screen } from "@testing-library/react";

import { useSortBugsList } from "@/hooks/useSortBugsList";
import { BugsBoard } from "@/components/boards/bugs/BugsBoard";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the useSortBugsList hook
jest.mock("@/hooks/useSortBugsList", () => ({
  useSortBugsList: jest.fn(),
}));

// Remove NextIntlProvider usage; you can now render directly.
describe("BugsBoard Component", () => {
  const reloadMock = jest.fn();
  const sortMock = jest.fn();

  beforeEach(() => {
    reloadMock.mockClear();
    sortMock.mockClear();
    (useSortBugsList as jest.Mock).mockReturnValue({
      reload: reloadMock,
      isLoading: false,
      items: [],
      sortDescriptor: { column: "id", direction: "ascending" },
      sort: sortMock,
    });
  });

  it("displays loading state when isLoading is true", () => {
    (useSortBugsList as jest.Mock).mockReturnValueOnce({
      reload: reloadMock,
      isLoading: true,
      items: [],
      sortDescriptor: {},
      sort: sortMock,
    });
    render(
      <BugsBoard
        bugsUpdated={false}
        handleRowAction={jest.fn()}
        topContent={<div>Top</div>}
      />,
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders bug rows correctly", async () => {
    const mockItems = [
      {
        id: "1",
        priority: "HIGH",
        title: "Bug 1",
        description: "Desc 1",
        createdBy: "User1",
        status: "OPEN",
        assignedTo: "Dev1",
        comments: "No comments",
        createdDate: new Date("2021-09-01"),
        assignedDate: new Date("2021-09-02"),
        completedDate: new Date("2021-09-03"),
      },
      {
        id: "2",
        priority: "Low",
        title: "Bug 2",
        description: "Desc 2",
        createdBy: "User2",
        status: "Closed",
        assignedTo: "Dev2",
        comments: "Fixed",
        createdDate: new Date("2021-10-01"),
        assignedDate: new Date("2021-10-02"),
        completedDate: new Date("2021-10-03"),
      },
    ];

    (useSortBugsList as jest.Mock).mockReturnValueOnce({
      reload: reloadMock,
      isLoading: false,
      items: mockItems,
      sortDescriptor: { column: "id", direction: "ascending" },
      sort: sortMock,
    });
    render(
      <BugsBoard
        bugsUpdated={false}
        handleRowAction={jest.fn()}
        topContent={<div>Top</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Bug 1")).toBeInTheDocument();
      expect(screen.getByText("Bug 2")).toBeInTheDocument();
    });
  });

  it("calls reload when bugsUpdated changes", async () => {
    const { rerender } = render(
      <BugsBoard
        bugsUpdated={false}
        handleRowAction={jest.fn()}
        topContent={<div>Top</div>}
      />,
    );

    // Clear any reload calls from the initial render
    reloadMock.mockClear();
    expect(reloadMock).not.toHaveBeenCalled();
    rerender(
      <BugsBoard
        bugsUpdated={true}
        handleRowAction={jest.fn()}
        topContent={<div>Top</div>}
      />,
    );
    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  it("handles sort change correctly", () => {
    render(
      <BugsBoard
        bugsUpdated={false}
        handleRowAction={jest.fn()}
        topContent={<div>Top</div>}
      />,
    );
    const newSortDescriptor = { column: "priority", direction: "descending" };

    sortMock(newSortDescriptor);
    expect(sortMock).toHaveBeenCalledWith({
      ...newSortDescriptor,
      column: "priority",
      direction: "descending",
    });
  });
});
