import { render, screen } from "@testing-library/react";

import PDFViewerPageLayout from "@/app/pdf/layout";

describe("PDFViewerPageLayout", () => {
  it("renders children correctly", () => {
    const testContent = "Test Content";

    render(
      <PDFViewerPageLayout>
        <div>{testContent}</div>
      </PDFViewerPageLayout>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(
      <PDFViewerPageLayout>
        <div>Test Content</div>
      </PDFViewerPageLayout>,
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
      "h-full",
    );

    const innerDiv = section?.firstChild as HTMLElement;

    expect(innerDiv).toHaveClass(
      "inline-block",
      "text-center",
      "max-w-screen-xl",
      "justify-center",
      "w-full",
      "h-full",
    );
  });
});
