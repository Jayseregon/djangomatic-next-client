import { render, screen } from "@testing-library/react";

import BoardsLayout from "@/app/boards/layout";

describe("BoardsLayout", () => {
  it("renders children correctly", () => {
    const testContent = "Test Content";

    render(
      <BoardsLayout>
        <div>{testContent}</div>
      </BoardsLayout>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(
      <BoardsLayout>
        <div>Test Content</div>
      </BoardsLayout>,
    );

    const section = container.querySelector("section");

    expect(section).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-4",
      "py-8",
      "md:py-10",
    );

    const innerDiv = section?.firstChild as HTMLElement;

    expect(innerDiv).toHaveClass(
      "inline-block",
      "w-full",
      "text-center",
      "justify-center",
    );
  });
});
