import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";

import SignInPage from "@/app/signin/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock icons and components - Fix import path
jest.mock("@/components/icons", () => ({
  Logo: ({ size }: { size: number }) => (
    <div data-size={size} data-testid="logo">
      Logo
    </div>
  ),
}));

jest.mock("@/components/ui/AppName", () => ({
  __esModule: true,
  default: () => <div data-testid="app-name">App Name</div>,
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
    signIn: jest.fn(),
    providerMap: {
      github: { id: "github", name: "GitHub" },
      "azure-ad": { id: "azure-ad", name: "Microsoft Entra ID" },
    },
  }),
  { virtual: true },
);

describe("SignInPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSignInPage = async (session: any = null) => {
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await SignInPage());
  };

  it("redirects to home if session exists", async () => {
    const mockSession = { user: { email: "test@example.com" } };

    await renderSignInPage(mockSession);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("renders sign-in page components when no session exists", async () => {
    await renderSignInPage(null);

    // Check for basic components
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toHaveAttribute("data-size", "100");
    expect(screen.getByTestId("app-name")).toBeInTheDocument();
    expect(screen.getByText("Please sign in to continue.")).toBeInTheDocument();
  });

  it("renders all provider buttons", async () => {
    await renderSignInPage(null);

    // Check for provider buttons
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
    expect(screen.getByText("Sign in with SSO")).toBeInTheDocument();
  });

  it("has correct layout structure and styling", async () => {
    const { container } = await renderSignInPage(null);

    // Check main container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass(
      "flex",
      "flex-col",
      "justify-between",
      "max-h-screen",
    );

    // Check content container
    const contentContainer = mainContainer.firstChild as HTMLElement;

    expect(contentContainer).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "flex-grow",
      "gap-2",
    );

    // Check heading styles
    const heading = screen.getByText(
      "Please sign in to continue.",
    ).parentElement;

    expect(heading).toHaveClass("inline-block");
  });

  it("renders buttons with correct styling", async () => {
    await renderSignInPage(null);

    const buttons = screen.getAllByRole("button");

    buttons.forEach((button) => {
      expect(button).toHaveClass(
        "bg-gradient-to-tr",
        "from-[#b249f8]",
        "to-[#01cfea]",
        "text-white",
        "shadow-lg",
        "rounded-full",
        "px-4",
        "py-2",
      );
    });
  });
});
