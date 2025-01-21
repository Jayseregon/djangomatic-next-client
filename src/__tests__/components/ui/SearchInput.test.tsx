import { render, screen, fireEvent, act } from "@testing-library/react";

import { SearchInput } from "@/src/components/ui/SearchInput";

describe("SearchInput", () => {
  it("renders search icon when collapsed", () => {
    render(<SearchInput />);

    const searchIcon = screen.getByTestId("search-trigger");

    expect(searchIcon).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("expands search input when icon is clicked", async () => {
    render(<SearchInput />);

    const searchIcon = screen.getByTestId("search-trigger");

    await act(async () => {
      fireEvent.click(searchIcon);
    });

    const searchInput = screen.getByRole("searchbox");

    expect(searchInput).toBeInTheDocument();
    expect(searchIcon).not.toBeInTheDocument();
  });

  it("collapses search input when clicking outside", async () => {
    await act(async () => {
      render(
        <div>
          <SearchInput />
          <div data-testid="outside">Outside</div>
        </div>,
      );
    });

    // First expand the search input
    const searchIcon = screen.getByTestId("search-trigger");

    await act(async () => {
      fireEvent.click(searchIcon);
    });

    // Click outside
    const outsideElement = screen.getByTestId("outside");

    await act(async () => {
      fireEvent.mouseDown(outsideElement);
    });

    await act(async () => {
      // Wait for any state updates to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Search input should be collapsed
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("search-trigger")).toBeInTheDocument();
  });

  it("stays expanded when alwaysExpanded prop is true", async () => {
    await act(async () => {
      render(<SearchInput alwaysExpanded />);
    });

    const searchInput = screen.getByRole("searchbox");

    expect(searchInput).toBeInTheDocument();
    expect(screen.queryByTestId("search-trigger")).not.toBeInTheDocument();

    // Click outside should not collapse the input
    await act(async () => {
      const outsideClick = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });

      document.dispatchEvent(outsideClick);
    });

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<SearchInput alwaysExpanded />);

    const searchInput = screen.getByRole("searchbox");

    expect(searchInput).toHaveAttribute("aria-label", "Search");
    expect(searchInput).toHaveAttribute("type", "search");
    expect(searchInput).toHaveAttribute("placeholder", "Search...");
  });

  it("applies correct styling classes", async () => {
    await act(async () => {
      render(<SearchInput alwaysExpanded />);
    });

    const inputWrapper = screen.getByRole("searchbox").parentElement;

    expect(inputWrapper).toHaveClass(
      "text-sm",
      "border-none",
      "outline-none",
      "ring-0",
      "focus:border-none",
      "focus:outline-none",
      "focus:ring-0",
    );
  });
});
