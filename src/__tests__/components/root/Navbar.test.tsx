import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { act } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import { fetchUserServer } from "@/actions/generic/action";
import { Navbar } from "@/src/components/root/Navbar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: jest.fn(),
}));

jest.mock("@/actions/generic/action", () => ({
  fetchUserServer: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock environment variable
process.env.NEXT_PUBLIC_APP_ENV = "local";

describe("Navbar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          name: "Test User",
          image: "https://example.com/avatar.png",
        },
      },
      status: "authenticated",
    });
    (useLocale as jest.Mock).mockReturnValue("en"); // Provide a mock return value
  });

  it("does not render on the signin page", () => {
    (usePathname as jest.Mock).mockReturnValue("/signin");

    render(<Navbar />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders correctly for authenticated user", async () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    const session = {
      user: {
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/avatar.png",
      },
    };

    (fetchUserServer as jest.Mock).mockResolvedValue({
      isAdmin: false,
    });

    await act(async () => {
      render(<Navbar session={session} />);
    });

    // Check for the environment-specific app name (partial match)
    expect(screen.getByText(/Djangomatic Pro/i)).toBeInTheDocument();
    expect(screen.getByTestId("avatar-image")).toHaveAttribute(
      "data-name",
      "Demo User",
    );
  });

  it("renders admin navigation items for admin user", async () => {
    (usePathname as jest.Mock).mockReturnValue("/admin");

    const session = {
      user: {
        email: "admin@example.com",
        name: "Admin User",
        image: "https://example.com/admin-avatar.png",
      },
    };

    (fetchUserServer as jest.Mock).mockResolvedValue({
      isAdmin: true,
      id: "test-id",
      email: "admin@example.com",
      name: "Admin User",
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    await act(async () => {
      render(<Navbar session={session} />);
    });

    await waitFor(() => {
      // Use getAllByRole to handle multiple matches and check for the specific one we want
      const adminLinks = screen.getAllByRole("link", { name: /admin/i });
      const desktopAdminLink = adminLinks.find((link) =>
        link.className.includes("underline decoration-foreground"),
      );

      expect(desktopAdminLink).toBeInTheDocument();

      const rndLink = screen.getAllByRole("link", { name: /r&d/i })[0];

      expect(rndLink).toBeInTheDocument();
    });
  });
});
