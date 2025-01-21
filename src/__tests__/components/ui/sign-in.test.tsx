import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn, signOut } from "next-auth/react";

import { SignIn, SignOut } from "@/src/components/ui/sign-in";

// Mock next-auth/react functions
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("Authentication Components", () => {
  describe("SignIn", () => {
    const buttonName = "Login with GitHub";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders with correct button text", () => {
      render(<SignIn buttonName={buttonName} />);
      expect(screen.getByRole("button")).toHaveTextContent(buttonName);
    });

    it("calls signIn with github provider when clicked", async () => {
      render(<SignIn buttonName={buttonName} />);
      const button = screen.getByRole("button");

      await userEvent.click(button);

      expect(signIn).toHaveBeenCalledWith("github");
      expect(signIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("SignOut", () => {
    const buttonName = "Logout";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders with correct button text", () => {
      render(<SignOut buttonName={buttonName} />);
      expect(screen.getByRole("button")).toHaveTextContent(buttonName);
    });

    it("calls signOut when clicked", async () => {
      render(<SignOut buttonName={buttonName} />);
      const button = screen.getByRole("button");

      await userEvent.click(button);

      expect(signOut).toHaveBeenCalled();
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });
});
