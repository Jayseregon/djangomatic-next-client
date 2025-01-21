import { render } from "@testing-library/react";

import {
  SkeletonDashboard,
  SkeletonSidebar,
} from "@/src/components/ui/Skeleton";

describe("SkeletonDashboard", () => {
  it("renders correct number of placeholder cards", () => {
    const { container } = render(<SkeletonDashboard />);
    const cards = container.querySelectorAll(".bg-stone-300");

    expect(cards).toHaveLength(6);
  });

  it.each([
    ["small", "h-24"],
    ["medium", "h-32"],
    ["large", "h-40"],
  ])("applies correct height class for %s size", (size, expectedClass) => {
    const { container } = render(
      <SkeletonDashboard size={size as "small" | "medium" | "large"} />,
    );
    const cards = container.querySelectorAll(".bg-stone-300");

    cards.forEach((card) => {
      expect(card).toHaveClass(expectedClass);
    });
  });

  it("has animate-pulse class", () => {
    const { container } = render(<SkeletonDashboard />);
    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass("animate-pulse");
  });
});

describe("SkeletonSidebar", () => {
  it("renders correct number of placeholder items", () => {
    const { container } = render(<SkeletonSidebar />);
    const items = container.querySelectorAll(".bg-stone-300");

    expect(items).toHaveLength(5);
  });

  it.each([
    ["small", "h-3"],
    ["medium", "h-4"],
    ["large", "h-5"],
  ])("applies correct height class for %s size", (size, expectedClass) => {
    const { container } = render(
      <SkeletonSidebar size={size as "small" | "medium" | "large"} />,
    );
    const items = container.querySelectorAll(".bg-stone-300");

    items.forEach((item) => {
      expect(item).toHaveClass(expectedClass);
    });
  });

  it("has animate-pulse class", () => {
    const { container } = render(<SkeletonSidebar />);
    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass("animate-pulse");
  });

  it("renders items with increasing widths", () => {
    const { container } = render(<SkeletonSidebar />);
    const items = container.querySelectorAll(".bg-stone-300");

    items.forEach((item, index) => {
      expect(item).toHaveClass(`w-${(index + 6) * 10}%`);
    });
  });
});
