import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";
import DocLinkButton from "@/src/components/docs/DocLinkButton";

// Mock window.open
const mockOpen = jest.fn();

window.open = mockOpen;

describe("DocLinkButton", () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it("renders the button with icon", () => {
    render(<DocLinkButton projectType="tds_docs" slug="pole-numbering" />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("has correct styling", () => {
    render(<DocLinkButton projectType="tds_docs" slug="pole-numbering" />);
    const container = screen.getByRole("button").parentElement;

    expect(container).toHaveStyle({
      position: "fixed",
      top: "5rem",
      right: "1.5rem",
      zIndex: 50,
    });
  });

  it("opens correct URL in new tab when clicked", async () => {
    render(<DocLinkButton projectType="tds_docs" slug="pole-numbering" />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledWith("/docs/tds/pole-numbering", "_blank");
  });

  it("doesn't open window when no matching doc is found", async () => {
    render(<DocLinkButton projectType="tds_docs" slug="nonexistent" />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("handles different project types correctly", async () => {
    render(
      <DocLinkButton projectType="admin_docs" slug="pci-reports-rogers" />,
    );

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockOpen).toHaveBeenCalledWith(
      "/docs/admin/pci-reports-rogers",
      "_blank",
    );
  });
});
