import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { UnAuthorized } from "@/src/components/auth/unAuthorized";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "UnAuthorized.access": "Mocked Unauthorized",
    };

    return translations[key] || key;
  },
}));

describe("UnAuthorized", () => {
  it("renders the stop sign icon", () => {
    render(<UnAuthorized />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("displays the unauthorized message", () => {
    render(<UnAuthorized />);
    expect(screen.getByText("Mocked Unauthorized")).toBeInTheDocument();
  });

  it("has the correct container styling", () => {
    const { container } = render(<UnAuthorized />);
    const parentDiv = container.querySelector(
      "div.flex.flex-col.items-center.gap-5.mt-10",
    );

    expect(parentDiv).toBeInTheDocument();
  });
});
