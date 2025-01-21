import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { AppPageTitle } from "@/components/saas/appPageTitle";
import { saasData } from "@/config/saasData";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock the context hooks
const mockSetAppName = jest.fn();
const mockSetInputData = jest.fn();

jest.mock("@/components/saas/inputDataProviders", () => ({
  useAppName: () => ({
    setAppName: mockSetAppName,
  }),
  useInputData: () => ({
    setInputData: mockSetInputData,
  }),
}));

describe("AppPageTitle", () => {
  const mockPath = "/saas/tds/lld/poles_numbering";

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue(mockPath);
  });

  it("renders app title correctly", () => {
    render(<AppPageTitle client="tds_saas" />);

    const foundApp = saasData.tds_saas.find((app) => app.href === mockPath);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      foundApp?.label || "",
    );
  });

  it("displays client name in uppercase", () => {
    render(<AppPageTitle client="tds_saas" />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("TDS");
  });

  it("shows override indicator when applicable", () => {
    // Mock a path for an override app
    const overridePath = "/saas/tds/override/spkv_override_gps";

    (usePathname as jest.Mock).mockReturnValue(overridePath);

    render(<AppPageTitle client="tds_saas" />);

    expect(screen.getByText("[override]")).toBeInTheDocument();
  });

  it("sets app data in context correctly", () => {
    render(<AppPageTitle client="tds_saas" />);

    const foundApp = saasData.tds_saas.find((app) => app.href === mockPath);

    // Verify setAppName was called with correct value
    expect(mockSetAppName).toHaveBeenCalledWith(foundApp?.label);

    // Verify setInputData was called with correct values
    expect(mockSetInputData).toHaveBeenCalledWith(expect.any(Function));
    const setInputDataCallback = mockSetInputData.mock.calls[0][0];
    const result = setInputDataCallback({});

    expect(result).toEqual({
      taskEndpoint: foundApp?.endpoint,
      asDownloadable: foundApp?.asDownloadable,
      willOverride: foundApp?.willOverride,
      dbClass: foundApp?.dbClass || "",
      appType: foundApp?.type || "",
      clientName: "tds",
    });
  });

  it("handles non-existent path gracefully", () => {
    (usePathname as jest.Mock).mockReturnValue("/invalid/path");

    render(<AppPageTitle client="tds_saas" />);

    // Should still render headings but with empty/default content
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(mockSetAppName).toHaveBeenCalledWith("");
  });
});
