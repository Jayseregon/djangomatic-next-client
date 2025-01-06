import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";

import { ConsoleDisplay } from "@/components/saas/consoleDisplay";

jest.mock("@/components/saas/inputDataProviders", () => ({
  useConsoleData: () => ({
    consoleOutput: "Line one\nLine two\nLine three",
  }),
}));

describe("ConsoleDisplay", () => {
  const messages = {
    consoleDisplay: {
      label: "Test label",
    },
  };

  it("renders console output with line breaks", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsoleDisplay />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Line one")).toBeInTheDocument();
    expect(screen.getByText("Line two")).toBeInTheDocument();
    expect(screen.getByText("Line three")).toBeInTheDocument();
  });

  it("clicking the download button triggers file download", () => {
    URL.createObjectURL = jest.fn(() => "blob:url");
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsoleDisplay />
      </NextIntlClientProvider>,
    );
    const button = screen.getByTitle("Download Console Log");

    fireEvent.click(button);
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("renders multiple lines of console output correctly", () => {
    const mockOutput = "First line\nSecond line\nThird line";

    jest.mock("@/components/saas/inputDataProviders", () => ({
      useConsoleData: () => ({
        consoleOutput: mockOutput,
      }),
    }));
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsoleDisplay />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Line one")).toBeInTheDocument();
    expect(screen.getByText("Line two")).toBeInTheDocument();
    expect(screen.getByText("Line three")).toBeInTheDocument();
  });
});
