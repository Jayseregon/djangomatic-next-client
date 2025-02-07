import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { PermissionButton } from "@/components/admin/PermissionButton";

describe("PermissionButton Component", () => {
  const mockHandleToggle = jest.fn();

  const mockUser = {
    id: "123",
    isAdmin: true,
    canEdit: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct initial state for enabled permission", () => {
    render(
      <PermissionButton
        fieldName="isAdmin"
        handleToggle={mockHandleToggle}
        user={mockUser}
      />,
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-color", "success");
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("renders with correct initial state for disabled permission", () => {
    render(
      <PermissionButton
        fieldName="canEdit"
        handleToggle={mockHandleToggle}
        user={mockUser}
      />,
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-color", "danger");
    expect(screen.getByTestId("uncheck-icon")).toBeInTheDocument();
  });

  it("handles toggle when clicked", async () => {
    render(
      <PermissionButton
        fieldName="isAdmin"
        handleToggle={mockHandleToggle}
        user={mockUser}
      />,
    );

    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(mockHandleToggle).toHaveBeenCalledWith("123", "isAdmin", false);
    expect(mockHandleToggle).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", async () => {
    render(
      <PermissionButton
        disabled={true}
        fieldName="isAdmin"
        handleToggle={mockHandleToggle}
        user={mockUser}
      />,
    );

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(mockHandleToggle).not.toHaveBeenCalled();
  });

  it("centers the button in container", () => {
    render(
      <PermissionButton
        fieldName="isAdmin"
        handleToggle={mockHandleToggle}
        user={mockUser}
      />,
    );

    const container = screen.getByRole("button").parentElement;

    expect(container).toHaveClass("flex", "justify-center", "items-center");
  });
});
