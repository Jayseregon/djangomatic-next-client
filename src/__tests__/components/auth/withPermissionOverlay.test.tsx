import { render, screen, waitFor } from "@testing-library/react";

import "@testing-library/jest-dom";
import {
  WithPermissionOverlay,
  WithPermissionOverlayDocs,
} from "@/src/components/auth/withPermissionOverlay";

// Mock fetchUserServer
jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn((email) =>
    Promise.resolve({
      email,
      canAccessVideoAdmin: email.includes("admin"),
      canAccessDocsTDS: email.includes("tds"),
    }),
  ),
}));

// Mock next-intl translations
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: string } = {
      "UnAuthorized.interact":
        "You do not have the required permissions to interact with this page.",
    };

    return translations[key] || key;
  },
}));

describe("WithPermissionOverlay Components", () => {
  const TestChild = () => <div data-testid="test-child">Test Content</div>;

  describe("WithPermissionOverlay", () => {
    it("renders children when user has permission", async () => {
      render(
        <WithPermissionOverlay
          email="admin@test.com"
          permission="canAccessVideoAdmin"
        >
          <TestChild />
        </WithPermissionOverlay>,
      );

      await waitFor(() => {
        const child = screen.getByTestId("test-child");

        expect(child).toBeInTheDocument();
        expect(child.parentElement).not.toHaveClass("pointer-events-none");
      });
    });

    it("renders children with overlay when user lacks permission", async () => {
      render(
        <WithPermissionOverlay
          email="user@test.com"
          permission="canAccessVideoAdmin"
        >
          <TestChild />
        </WithPermissionOverlay>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("test-child")).toBeInTheDocument();
        expect(
          screen.getByText(/You do not have the required permissions/),
        ).toBeInTheDocument();
        const contentDiv = screen.getByTestId("test-child").parentElement;

        expect(contentDiv).toHaveClass("pointer-events-none");
      });
    });
  });

  describe("WithPermissionOverlayDocs", () => {
    it("renders children without blur when user has permission", async () => {
      render(
        <WithPermissionOverlayDocs
          email="tds@test.com"
          permission="canAccessDocsTDS"
        >
          <TestChild />
        </WithPermissionOverlayDocs>,
      );

      await waitFor(() => {
        const child = screen.getByTestId("test-child");

        expect(child).toBeInTheDocument();
        expect(child.parentElement).not.toHaveClass("blur");
      });
    });

    it("renders children with blur and overlay when user lacks permission", async () => {
      render(
        <WithPermissionOverlayDocs
          email="user@test.com"
          permission="canAccessDocsTDS"
        >
          <TestChild />
        </WithPermissionOverlayDocs>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("test-child")).toBeInTheDocument();
        expect(
          screen.getByText(/You do not have the required permissions/),
        ).toBeInTheDocument();
        const contentDiv = screen.getByTestId("test-child").parentElement;

        expect(contentDiv).toHaveClass("blur", "pointer-events-none");
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("handles fetch errors gracefully", async () => {
      const mockFetchUserServer =
        require("@/actions/generic/action").fetchUserServer;

      mockFetchUserServer.mockRejectedValueOnce(new Error("Fetch failed"));

      render(
        <WithPermissionOverlay
          email="error@test.com"
          permission="canAccessVideoAdmin"
        >
          <TestChild />
        </WithPermissionOverlay>,
      );

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
        expect(screen.getByTestId("test-child").parentElement).toHaveClass(
          "pointer-events-none",
        );
      });
    });
  });
});
