import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import {
  defaultBody,
  docsBody,
  videosBody,
  reportsBody,
  appsTdsBody,
  appsCogecoBody,
  appsVistabeamBody,
  appsXploreBody,
  appsTelusBody,
} from "@/components/admin/UserTableBodies";
import { UserSchema } from "@/interfaces/lib";
import { PermissionSwitchProps } from "@/components/admin/PermissionButton"; // Import the actual props type

// Use jest.mock instead of manual mock
jest.mock("@/components/admin/PermissionButton", () => ({
  // Use the actual props type for better type checking
  PermissionButton: ({
    user,
    fieldName,
    handleToggle,
    disabled,
  }: PermissionSwitchProps) => {
    // Ensure isDisabled is strictly boolean true if disabled is true
    const isDisabled = disabled === true;

    return (
      <button
        aria-disabled={isDisabled}
        data-testid={`permission-button-${fieldName}`}
        disabled={isDisabled} // Set the native disabled attribute
        role="button"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          // Only call toggle if not disabled
          if (!isDisabled) {
            handleToggle(user.id, fieldName, !user[fieldName]);
          }
        }}
      >
        {user[fieldName] ? "Enabled" : "Disabled"}
      </button>
    );
  },
}));

// Mock HeroUI components
jest.mock("@heroui/react", () => ({
  TableRow: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));

describe("UserTableBodies", () => {
  const mockUser: UserSchema = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    isAdmin: false,
    createdAt: new Date(),
    lastLogin: new Date(),
    isRnDTeam: false,
    canAccessChatbot: false,
    canAccessSeticsCollection: false,
    canAccessAppsTdsHLD: false,
    canAccessAppsTdsLLD: false,
    canAccessAppsTdsArcGIS: false,
    canAccessAppsTdsOverride: false,
    canAccessAppsTdsAdmin: false,
    canAccessAppsTdsSuper: false,
    canAccessAppsCogecoHLD: false,
    canAccessAppsVistabeamHLD: false,
    canAccessAppsVistabeamOverride: false,
    canAccessAppsVistabeamSuper: false,
    canAccessAppsXploreAdmin: false,
    canAccessAppsXploreHLD: false,
    canAccessAppsTelusAdmin: false,
    canAccessBugReportBoard: false,
    canAccessRoadmapBoard: false,
    canAccessReports: false,
    canDeleteReports: false,
    canAccessRnd: false,
    canAccessDocsTDS: false,
    canAccessDocsCogeco: false,
    canAccessDocsVistabeam: false,
    canAccessDocsXplore: false,
    canAccessDocsComcast: false,
    canAccessDocsAdmin: false,
    canAccessDocsKC: false,
    canAccessDocsKCSecure: false,
    canAccessVideoAdmin: false,
    canAccessVideoGIS: false,
    canAccessVideoCAD: false,
    canAccessVideoLiDAR: false,
    canAccessVideoEng: false,
    canAccessVideoSttar: false,
    canAccessGlobalAll: false,
    canAccessGlobalAtlantic: false,
    canAccessGlobalCentral: false,
    canAccessGlobalQuebec: false,
    canAccessGlobalWest: false,
    canAccessGlobalUSA: false,
    rndTasks: [],
  };

  const mockHandleToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("defaultBody", () => {
    it("renders admin view correctly", () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: true,
              isDisabled: false, // Pass isDisabled instead of isSessionSuperUser
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(7);
    });

    it("renders non-admin view correctly", () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isDisabled: false, // Pass isDisabled instead of isSessionSuperUser
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6);
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("docsBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {docsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled instead of isSessionSuperUser
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(8); // Docs view has 8 toggle buttons
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {docsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("videosBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {videosBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6); // Videos view has 6 toggle buttons
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {videosBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("reportsBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {reportsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2); // Reports view has 2 toggle buttons
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {reportsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("appsTdsBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {appsTdsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6); // TDS view has 6 toggle buttons
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {appsTdsBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("appsCogecoBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {appsCogecoBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1); // COGECO view has 1 toggle button
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {appsCogecoBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("appsVistabeamBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {appsVistabeamBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(3); // Vistabeam view has 3 toggle buttons
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {appsVistabeamBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("appsXploreBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {appsXploreBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2); // Xplore view has 1 toggle button
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {appsXploreBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("appsTelusBody", () => {
    it("renders correctly", () => {
      render(
        <table>
          <tbody>
            {appsTelusBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: false, // Pass isDisabled
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1); // Telus view has 1 toggle button
    });

    it("disables buttons when isDisabled is true", () => {
      render(
        <table>
          <tbody>
            {appsTelusBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isDisabled: true, // Pass isDisabled as true
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("Permission toggling", () => {
    it("calls handleToggle with correct arguments when not disabled", async () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isDisabled: false, // Ensure button is not disabled
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      await userEvent.click(buttons[0]);

      expect(mockHandleToggle).toHaveBeenCalledTimes(1);
      expect(mockHandleToggle).toHaveBeenCalledWith(
        mockUser.id,
        "isAdmin", // Check the specific field name if needed
        !mockUser.isAdmin, // Check the expected value
      );
    });

    it("doesn't call handleToggle when disabled", async () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isDisabled: true, // Ensure button is disabled via prop
            })}
          </tbody>
        </table>,
      );

      // Target the specific button expected to be disabled
      const isAdminButton = screen.getByTestId("permission-button-isAdmin");

      // First, assert that the button IS actually disabled in the DOM
      expect(isAdminButton).toBeDisabled();

      // Attempt to click the disabled button
      // userEvent should respect the disabled attribute and not fire the handler
      await userEvent.click(isAdminButton);

      // Assert that the mock toggle function was not called
      expect(mockHandleToggle).not.toHaveBeenCalled();
    });
  });
});
