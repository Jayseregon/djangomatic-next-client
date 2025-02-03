import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { UserData } from "@/src/components/auth/UserData";

describe("UserData", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      role: "user",
    },
  };

  const getJsonContent = () => {
    const preElement = screen.getByText((content) => {
      try {
        JSON.parse(content);

        return true;
      } catch {
        return false;
      }
    });

    return preElement.textContent?.trim();
  };

  it("renders without crashing", () => {
    render(<UserData session={mockSession} />);
    expect(screen.getByTestId("code-snippet")).toBeInTheDocument();
  });

  it("renders session data in JSON format", () => {
    render(<UserData session={mockSession} />);
    const content = getJsonContent();

    const parsed = JSON.parse(content!);

    expect(parsed.user.name).toBe("Test User");
    expect(parsed.user.email).toBe("test@example.com");
  });

  it("maintains proper JSON formatting", () => {
    render(<UserData session={mockSession} />);
    const content = getJsonContent();

    const expectedFormatted = JSON.stringify(mockSession, null, 2);

    expect(content).toBe(expectedFormatted);
  });

  it("handles complex session objects", () => {
    const complexSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        permissions: ["read", "write"],
        metadata: {
          lastLogin: "2024-01-01",
          isActive: true,
        },
      },
      expires: "2024-12-31",
    };

    render(<UserData session={complexSession} />);
    const content = getJsonContent();
    const parsed = JSON.parse(content!);

    expect(parsed.user.permissions).toHaveLength(2);
    expect(parsed.user.metadata.isActive).toBe(true);
  });
});
