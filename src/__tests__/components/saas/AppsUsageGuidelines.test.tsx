import { render, screen } from "@testing-library/react";

import AppsUsageGuidelines from "@/components/saas/AppsUsageGuidelines";
import messages from "@/messages/en.json";

// Mock next-intl to use actual translations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    // Split the key by dots and traverse the messages object
    return (
      key
        .split(".")
        .reduce((obj, key) => obj[key], messages.AppsUsageGuidelines as any) ||
      key
    );
  },
}));

describe("AppsUsageGuidelines", () => {
  beforeEach(() => {
    render(<AppsUsageGuidelines />);
  });

  it("renders main guidance paragraph", () => {
    expect(
      screen.getByText(messages.AppsUsageGuidelines.guidanceParagraph),
    ).toBeInTheDocument();
  });

  describe("Getting Started Section", () => {
    it("renders section title and content", () => {
      const section = messages.AppsUsageGuidelines.sections.gettingStarted;

      expect(screen.getByText(section.title)).toBeInTheDocument();
      expect(screen.getByText(section.paragraph)).toBeInTheDocument();

      // Test navigation list item
      const navItem = section.list.navigation;

      expect(screen.getByText(new RegExp(navItem.title))).toBeInTheDocument();
      expect(screen.getByText(navItem.description)).toBeInTheDocument();
    });
  });

  describe("Permissions & Access Section", () => {
    it("renders section with warning icon", () => {
      const section = messages.AppsUsageGuidelines.sections.permissionsAccess;

      expect(screen.getByText(section.title)).toBeInTheDocument();
      expect(screen.getByText(section.paragraph1)).toBeInTheDocument();
      expect(document.querySelector("svg")).toBeInTheDocument(); // Check for warning icon
    });

    it("renders all permission items", () => {
      const items =
        messages.AppsUsageGuidelines.sections.permissionsAccess.list;

      Object.values(items).forEach((item) => {
        expect(screen.getByText(new RegExp(item.title))).toBeInTheDocument();
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });
  });

  describe("Maximizing Benefits Section", () => {
    it("renders section and list items", () => {
      const section = messages.AppsUsageGuidelines.sections.maximizingBenefits;

      expect(screen.getByText(section.title)).toBeInTheDocument();
      expect(screen.getByText(section.paragraph)).toBeInTheDocument();

      // Test list items
      Object.values(section.list).forEach((item) => {
        expect(screen.getByText(new RegExp(item.title))).toBeInTheDocument();
        expect(screen.getByText(item.description)).toBeInTheDocument();
      });
    });
  });

  describe("Feedback & Contributions Section", () => {
    it("renders feedback section", () => {
      const section =
        messages.AppsUsageGuidelines.sections.feedbackContributions;

      expect(screen.getByText(section.title)).toBeInTheDocument();
      expect(screen.getByText(section.paragraph1)).toBeInTheDocument();
      expect(screen.getByText(section.paragraph2)).toBeInTheDocument();
    });
  });

  describe("Styling and Structure", () => {
    it("applies correct text justification", () => {
      const mainContainer = screen.getByText(
        messages.AppsUsageGuidelines.guidanceParagraph,
      ).parentElement;

      expect(mainContainer).toHaveClass("text-justify");
    });

    it("maintains correct section spacing", () => {
      const sections = screen.getAllByRole("heading", { level: 2 });

      sections.forEach((section) => {
        expect(section.parentElement).toHaveClass("mt-8");
      });
    });
  });
});
