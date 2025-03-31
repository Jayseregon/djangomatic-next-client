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

// Use jest.mock instead of manual mock
jest.mock("@/components/admin/PermissionButton", () => ({
  PermissionButton: ({ user, fieldName, handleToggle, disabled }: any) => {
    // Force disabled to be a boolean
    const isDisabled = disabled === true;

    return (
      <button
        aria-disabled={isDisabled}
        data-testid={`permission-button-${fieldName}`}
        disabled={isDisabled}
        role="button"
        type="button"
        onClick={(e) => {
          e.preventDefault();
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6); // Admin view has 5 toggle buttons
    });

    it("renders non-admin view correctly", () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(5); // Non-admin view has 4 toggle buttons
    });

    it("disables buttons for non-super users", () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isSessionSuperUser: false,
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(8); // Docs view has 8 toggle buttons
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6); // Videos view has 6 toggle buttons
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2); // Reports view has 2 toggle buttons
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(6); // TDS view has 6 toggle buttons
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1); // COGECO view has 1 toggle button
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(3); // Vistabeam view has 3 toggle buttons
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(2); // Xplore view has 1 toggle button
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
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(1); // Telus view has 1 toggle button
    });
  });

  describe("Permission toggling", () => {
    it("calls handleToggle with correct arguments", async () => {
      render(
        <table>
          <tbody>
            {defaultBody({
              user: mockUser,
              handleToggle: mockHandleToggle,
              isAdmin: false,
              isSessionSuperUser: true,
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      await userEvent.click(buttons[0]);

      expect(mockHandleToggle).toHaveBeenCalledTimes(1);
      expect(mockHandleToggle).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
        expect.any(Boolean),
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
              isSessionSuperUser: false,
            })}
          </tbody>
        </table>,
      );

      const buttons = screen.getAllByRole("button");

      await userEvent.click(buttons[0]);

      expect(mockHandleToggle).not.toHaveBeenCalled();
    });
  });
});
