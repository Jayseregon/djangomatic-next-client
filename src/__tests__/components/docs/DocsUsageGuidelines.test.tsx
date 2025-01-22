import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import DocsUsageGuidelines from "@/src/components/docs/DocsUsageGuidelines";

// Mock next-intl translations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: string } = {
      guidanceParagraph:
        "This guide will help you navigate and utilize the documentation effectively.",
      "sections.understandingDocumentation.title":
        "Understanding the Documentation",
      "sections.understandingDocumentation.paragraph":
        "Our documentation is designed to be user-friendly",
      "sections.understandingDocumentation.list.searchFunctionality.title":
        "Search Functionality",
      "sections.understandingDocumentation.list.searchFunctionality.description":
        "Use the search bar",
      "sections.understandingDocumentation.list.navigation.title": "Navigation",
      "sections.understandingDocumentation.list.navigation.description":
        "Use the sidebar",
      "sections.understandingDocumentation.list.examplesTutorials.title":
        "Examples and Tutorials",
      "sections.understandingDocumentation.list.examplesTutorials.description":
        "Look for examples",
      "sections.permissionsAccess.title": "Permissions and Access",
      "sections.permissionsAccess.paragraph1":
        "Access to specific documentation is controlled",
      "sections.permissionsAccess.paragraph2": "Without proper permissions",
      "sections.permissionsAccess.list.confidentiality.title":
        "Confidentiality",
      "sections.permissionsAccess.list.confidentiality.description":
        "Ensures sensitive information",
      "sections.permissionsAccess.list.controlledAccess.title":
        "Controlled Access",
      "sections.permissionsAccess.list.controlledAccess.description":
        "Maintains strict control",
      "sections.gettingMostOutTools.title": "Getting the Most Out of Our Tools",
      "sections.gettingMostOutTools.paragraph": "To maximize the benefits",
      "sections.gettingMostOutTools.list.startBasics.title":
        "Start with the Basics",
      "sections.gettingMostOutTools.list.startBasics.description":
        "Begin with introductory guides",
      "sections.gettingMostOutTools.list.exploreAdvanced.title":
        "Explore Advanced Features",
      "sections.gettingMostOutTools.list.exploreAdvanced.description":
        "Explore more features",
      "sections.gettingMostOutTools.list.useSupport.title":
        "Use Support Resources",
      "sections.gettingMostOutTools.list.useSupport.description":
        "Consult our FAQ",
      "sections.feedbackContributions.title": "Feedback and Contributions",
      "sections.feedbackContributions.paragraph1":
        "Your feedback is invaluable",
      "sections.feedbackContributions.paragraph2": "Consider sharing solutions",
    };

    return translations[key] || key;
  },
}));

describe("DocsUsageGuidelines", () => {
  it("renders the main guidance paragraph", () => {
    render(<DocsUsageGuidelines />);
    expect(
      screen.getByText(
        "This guide will help you navigate and utilize the documentation effectively.",
      ),
    ).toBeInTheDocument();
  });

  it("renders all main section titles", () => {
    render(<DocsUsageGuidelines />);

    const expectedTitles = [
      "Understanding the Documentation",
      "Permissions and Access",
      "Getting the Most Out of Our Tools",
      "Feedback and Contributions",
    ];

    expectedTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("renders the understanding documentation section with all subsections", () => {
    render(<DocsUsageGuidelines />);

    expect(screen.getByText(/^Search Functionality/)).toBeInTheDocument();
    expect(screen.getByText(/^Navigation/)).toBeInTheDocument();
    expect(screen.getByText(/^Examples and Tutorials/)).toBeInTheDocument();
  });

  it("renders the permissions section with warning icon", () => {
    render(<DocsUsageGuidelines />);

    expect(screen.getByText("Permissions and Access")).toBeInTheDocument();
    expect(
      screen.getByText("Access to specific documentation is controlled"),
    ).toBeInTheDocument();
    const warningIcon = document.querySelector(".flex.inline-block.gap-2");

    expect(warningIcon).toBeInTheDocument();
  });

  it("renders feedback section with both paragraphs", () => {
    render(<DocsUsageGuidelines />);

    expect(screen.getByText("Your feedback is invaluable")).toBeInTheDocument();
    expect(screen.getByText("Consider sharing solutions")).toBeInTheDocument();
  });

  it("applies correct styling to section titles", () => {
    render(<DocsUsageGuidelines />);

    const sectionTitles = screen.getAllByRole("heading", { level: 2 });

    sectionTitles.forEach((title) => {
      expect(title).toHaveClass("text-2xl", "font-bold");
    });
  });

  it("renders all list items with correct formatting", () => {
    render(<DocsUsageGuidelines />);

    const lists = document.querySelectorAll("ul");

    lists.forEach((list) => {
      expect(list).toHaveClass("list-disc", "pl-5");
    });
  });
});
