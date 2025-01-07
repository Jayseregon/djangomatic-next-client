import { render, screen } from "@testing-library/react";

import AdminLayout from "@/app/admin/layout";

describe("AdminLayout", () => {
  it("renders children correctly", () => {
    const testContent = "Test Content";

    render(
      <AdminLayout>
        <div>{testContent}</div>
      </AdminLayout>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>,
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
      "max-w-full",
      "text-center",
      "justify-center",
    );
  });
});
