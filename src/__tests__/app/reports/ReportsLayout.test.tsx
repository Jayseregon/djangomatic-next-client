import { render, screen } from "@testing-library/react";

import ReportsLayout from "@/app/reports/layout";

describe("ReportsLayout", () => {
  it("renders children correctly", () => {
    const testContent = "Test Content";

    render(
      <ReportsLayout>
        <div>{testContent}</div>
      </ReportsLayout>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(
      <ReportsLayout>
        <div>Test Content</div>
      </ReportsLayout>,
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
      "w-full",
    );

    const innerDiv = section?.firstChild as HTMLElement;

    expect(innerDiv).toHaveClass(
      "inline-block",
      "text-center",
      "max-w-screen-xl",
      "justify-center",
      "w-full",
    );
  });
});
