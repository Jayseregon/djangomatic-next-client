import { render, screen, fireEvent } from "@testing-library/react";

import TableOfContentsMdx from "@/components/mdx/TableOfContentsMdx";

describe("TableOfContentsMdx", () => {
  const mockItems = [
    { id: "section-1", title: "Section 1" },
    { id: "section-2", title: "Section 2" },
    { id: "section-3", title: "Section 3" },
  ];

  const mockTitle = "Table of Contents";

  beforeEach(() => {
    // Mock scrollTo
    window.scrollTo = jest.fn();

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 0,
      y: 0,
      toJSON: jest.fn(),
      top: 100,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    }));
  });

  it("renders the title correctly", () => {
    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it("renders all items in the table of contents", () => {
    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);

    mockItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("creates correct anchor links for each item", () => {
    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);

    mockItems.forEach((item) => {
      const link = screen.getByText(item.title);

      expect(link.closest("a")).toHaveAttribute("href", `#${item.id}`);
    });
  });

  it("handles click events and scrolls to the correct section", () => {
    // Mock getElementById
    document.getElementById = jest.fn().mockImplementation(() => ({
      getBoundingClientRect: () => ({
        top: 100,
      }),
    }));

    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);

    const firstLink = screen.getByText("Section 1");

    fireEvent.click(firstLink);

    // Check if preventDefault was called
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("handles clicks when target element does not exist", () => {
    // Mock getElementById returning null
    document.getElementById = jest.fn().mockReturnValue(null);

    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);

    const firstLink = screen.getByText("Section 1");

    fireEvent.click(firstLink);

    // Verify scrollTo wasn't called
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("applies correct scroll offset when clicking links", () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 200,
      }),
    };

    document.getElementById = jest.fn().mockReturnValue(mockElement);
    window.pageYOffset = 100;

    render(<TableOfContentsMdx items={mockItems} title={mockTitle} />);

    const link = screen.getByText("Section 1");

    fireEvent.click(link);

    // Verify scroll calculation (200 + 100 - 100 = 200)
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 200,
      behavior: "smooth",
    });
  });
});
