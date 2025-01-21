import { render, screen } from "@testing-library/react";

import { LoadingContent } from "@/src/components/ui/LoadingContent";

describe("LoadingContent", () => {
  it("renders loading spinner with correct label", () => {
    render(<LoadingContent />);

    const spinner = screen.getByTestId("loading-spinner");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveTextContent("Loading...");
  });

  it("renders with primary color", () => {
    render(<LoadingContent />);

    const spinner = screen.getByTestId("loading-spinner");

    expect(spinner).toHaveAttribute("data-color", "primary");
  });

  it("renders with correct container classes", () => {
    const { container } = render(<LoadingContent />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "pt-24",
    );
  });
});
