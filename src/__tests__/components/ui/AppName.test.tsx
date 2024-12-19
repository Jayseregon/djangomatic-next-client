import { render, screen } from "@testing-library/react";

import AppName from "@/src/components/ui/AppName";
import { siteConfig } from "@/src/config/site";

describe("AppName component", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders app name without extension in production", () => {
    process.env.NEXT_PUBLIC_APP_ENV = "production";
    render(<AppName />);

    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    expect(screen.queryByText(/\[.*\]/)).not.toBeInTheDocument();
  });

  it("renders app name with [local] extension in local environment", () => {
    process.env.NEXT_PUBLIC_APP_ENV = "local";
    render(<AppName />);

    const appNameElement = screen.getByText(siteConfig.name);
    const extensionElement = screen.getByText(/\[local\]/);

    expect(appNameElement).toBeInTheDocument();
    expect(extensionElement).toBeInTheDocument();
  });

  it("renders app name with [staging] extension in staging environment", () => {
    process.env.NEXT_PUBLIC_APP_ENV = "staging";
    render(<AppName />);

    const appNameElement = screen.getByText(siteConfig.name);
    const extensionElement = screen.getByText(/\[staging\]/);

    expect(appNameElement).toBeInTheDocument();
    expect(extensionElement).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<AppName />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveClass("flex", "flex-col", "items-center");
  });
});
