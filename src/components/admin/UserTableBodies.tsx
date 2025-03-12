import type { JSX } from "react";

import { TableRow, TableCell } from "@heroui/react";

import { UserSchema } from "@/interfaces/lib";

import { PermissionButton } from "./PermissionButton";

/**
 * Renders the default table body.
 *
 * @param {Object} params - The parameters for the default table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered default table body.
 */
export const defaultBody = ({
  user,
  handleToggle,
  isAdmin,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isAdmin: boolean;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
    </TableRow>
  );
};

/**
 * Renders the docs table body.
 *
 * @param {Object} params - The parameters for the docs table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered docs table body.
 */
export const docsBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
 *
 * @param {Object} params - The parameters for the videos table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered videos table body.
 */
export const videosBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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

export const reportsBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
 *
 * @param {Object} params - The parameters for the apps TDS table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered apps TDS table body.
 */
export const appsTdsBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
 *
 * @param {Object} params - The parameters for the apps COGECO table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered apps COGECO table body.
 */
export const appsCogecoBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
 *
 * @param {Object} params - The parameters for the apps Vistabeam table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered apps Vistabeam table body.
 */
export const appsVistabeamBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
 *
 * @param {Object} params - The parameters for the apps Xplore table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered apps Xplore table body.
 */
export const appsXploreBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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
    </TableRow>
  );
};

/**
 * Renders the apps Telus table body.
 *
 * @param {Object} params - The parameters for the apps Xplore table body.
 * @param {UserSchema} params.user - The user object.
 * @returns {JSX.Element} The rendered apps Xplore table body.
 */
export const appsTelusBody = ({
  user,
  handleToggle,
  isSessionSuperUser,
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isSessionSuperUser: boolean;
}): JSX.Element => {
  const disabled = !isSessionSuperUser;

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

export const renderTableBody = (
  user: UserSchema,
  selectedMenu: string,
  isAdmin: boolean,
  isSessionSuperUser: boolean,
  handleToggle: (id: string, field: string, value: boolean) => void
) => {
  switch (selectedMenu) {
    case "docs":
      return docsBody({ user, handleToggle, isSessionSuperUser });
    case "videos":
      return videosBody({ user, handleToggle, isSessionSuperUser });
    case "reports":
      return reportsBody({ user, handleToggle, isSessionSuperUser });
    case "apps-tds":
      return appsTdsBody({ user, handleToggle, isSessionSuperUser });
    case "apps-cogeco":
      return appsCogecoBody({ user, handleToggle, isSessionSuperUser });
    case "apps-vistabeam":
      return appsVistabeamBody({ user, handleToggle, isSessionSuperUser });
    case "apps-xplore":
      return appsXploreBody({ user, handleToggle, isSessionSuperUser });
    case "apps-telus":
      return appsTelusBody({ user, handleToggle, isSessionSuperUser });
    default:
      return defaultBody({ user, handleToggle, isAdmin, isSessionSuperUser });
  }
};
