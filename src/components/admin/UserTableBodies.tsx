import type { JSX } from "react";

import { TableRow, TableCell } from "@heroui/react";

import { UserSchema } from "@/interfaces/lib";
import { superUserEmails } from "@/config/superUser";

import { PermissionButton } from "./PermissionButton";

// Define interfaces for props
interface BaseBodyProps {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isDisabled: boolean;
}

interface DefaultBodyProps extends BaseBodyProps {
  isAdmin: boolean;
}

/**
 * Renders the default table body.
 */
export const defaultBody = ({
  user,
  handleToggle,
  isAdmin,
  isDisabled,
}: DefaultBodyProps): JSX.Element => {
  const disabled = isDisabled;

  if (isAdmin) {
    return (
      <TableRow key={user.email}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="isAdmin"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="isRnDTeam"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="canAccessRoadmapBoard"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="canAccessBugReportBoard"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="canAccessRnd"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="canAccessChatbot"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            disabled={disabled}
            fieldName="canAccessSeticsCollection"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="isAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessRoadmapBoard"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessBugReportBoard"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessRnd"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessChatbot"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessSeticsCollection"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the docs table body.
 */
export const docsBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsKC"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsKCSecure"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsCogeco"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsComcast"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsTDS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsVistabeam"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessDocsXplore"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the videos table body.
 */
export const videosBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoGIS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoCAD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoLiDAR"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoEng"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessVideoSttar"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the reports table body.
 */
export const reportsBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessReports"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canDeleteReports"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps TDS table body.
 */
export const appsTdsBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsLLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsArcGIS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsOverride"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTdsSuper"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps COGECO table body.
 */
export const appsCogecoBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsCogecoHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps Vistabeam table body.
 */
export const appsVistabeamBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsVistabeamHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsVistabeamOverride"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsVistabeamSuper"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps Xplore table body.
 */
export const appsXploreBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsXploreAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsXploreHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps Telus table body.
 */
export const appsTelusBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessAppsTelusAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Renders the apps Xplore table body.
 */
export const appsGlobalBody = ({
  user,
  handleToggle,
  isDisabled,
}: BaseBodyProps): JSX.Element => {
  const disabled = isDisabled;

  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalAll"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalAtlantic"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalQuebec"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalCentral"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalWest"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          disabled={disabled}
          fieldName="canAccessGlobalUSA"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Selects and renders the appropriate table body based on the selected menu.
 */
export const renderTableBody = (
  user: UserSchema,
  selectedMenu: string,
  isAdmin: boolean,
  isSessionSuperUser: boolean,
  handleToggle: (id: string, field: string, value: boolean) => void,
): JSX.Element => {
  const isTargetUserSuperUser = superUserEmails.includes(user.email);
  const isDisabled = !isSessionSuperUser && isTargetUserSuperUser;

  const baseProps: BaseBodyProps = { user, handleToggle, isDisabled };

  switch (selectedMenu) {
    case "docs":
      return docsBody(baseProps);
    case "videos":
      return videosBody(baseProps);
    case "reports":
      return reportsBody(baseProps);
    case "apps-global":
      return appsGlobalBody(baseProps);
    case "apps-tds":
      return appsTdsBody(baseProps);
    case "apps-cogeco":
      return appsCogecoBody(baseProps);
    case "apps-vistabeam":
      return appsVistabeamBody(baseProps);
    case "apps-xplore":
      return appsXploreBody(baseProps);
    case "apps-telus":
      return appsTelusBody(baseProps);
    default:
      return defaultBody({ ...baseProps, isAdmin });
  }
};
