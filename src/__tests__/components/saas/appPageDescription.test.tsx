import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import {
  AppPageDescription,
  PillVersioning,
} from "@/src/components/saas/appPageDescription";
import { saasData } from "@/src/config/saasData";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("AppPageDescription Components", () => {
  const mockPath = "/saas/tds/lld/poles_numbering";

  describe("AppPageDescription", () => {
    beforeEach(() => {
      (usePathname as jest.Mock).mockReturnValue(mockPath);
    });

    it("renders app description for given client and path", () => {
      render(<AppPageDescription client="tds_saas" />);

      // Check description
      expect(
        screen.getByText("poles_numbering.description"),
      ).toBeInTheDocument();

      // Check version and date
      const foundApp = saasData.tds_saas.find((app) => app.href === mockPath);

      expect(screen.getByText(foundApp?.version as string)).toBeInTheDocument();
      expect(
        screen.getByText(foundApp?.date_upd as string),
      ).toBeInTheDocument();
    });

    it("uses correct translation namespace when provided", () => {
      render(
        <AppPageDescription client="tds_saas" targetTranslation="customNS" />,
      );

      expect(
        screen.getByText("poles_numbering.description"),
      ).toBeInTheDocument();
    });

    it("handles non-existent path gracefully", () => {
      (usePathname as jest.Mock).mockReturnValue("/invalid/path");

      render(<AppPageDescription client="tds_saas" />);

      // Should render empty description
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  describe("PillVersioning", () => {
    const mockProps = {
      version: "1.0.0",
      dateUpdated: "2024-03-26",
    };

    it("renders version pill correctly", () => {
      render(<PillVersioning {...mockProps} />);

      expect(screen.getByText("Version")).toBeInTheDocument();
      expect(screen.getByText(mockProps.version)).toBeInTheDocument();
    });

    it("renders last updated pill correctly", () => {
      render(<PillVersioning {...mockProps} />);

      expect(screen.getByText("Last Updated")).toBeInTheDocument();
      expect(screen.getByText(mockProps.dateUpdated)).toBeInTheDocument();
    });

    it("handles undefined props gracefully", () => {
      render(<PillVersioning dateUpdated={undefined} version={undefined} />);

      // Should still render the labels
      expect(screen.getByText("Version")).toBeInTheDocument();
      expect(screen.getByText("Last Updated")).toBeInTheDocument();
    });
  });
});
