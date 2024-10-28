import { TableRow, TableCell } from "@nextui-org/react";

import { UserSchema } from "@/interfaces/lib";

import { PermissionButton } from "./UserTable";

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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
  isAdmin: boolean;
}): JSX.Element => {
  if (isAdmin) {
    return (
      <TableRow key={user.email}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="isAdmin"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="isRnDTeam"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessBoards"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessRnd"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessReports"
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
          fieldName="isAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessBoards"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessRnd"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessReports"
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessDocsTDS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessDocsCogeco"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessDocsVistabeam"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessVideoDefault"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessVideoQGIS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessVideoSttar"
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsTdsHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsTdsLLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsTdsArcGIS"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsTdsOverride"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsTdsAdmin"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsVistabeamHLD"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsVistabeamOverride"
          handleToggle={handleToggle}
          user={user}
        />
      </TableCell>
      <TableCell>
        <PermissionButton
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
}: {
  user: UserSchema;
  handleToggle: (id: string, field: string, value: boolean) => void;
}): JSX.Element => {
  return (
    <TableRow key={user.email}>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <PermissionButton
          fieldName="canAccessAppsXploreAdmin"
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
  handleToggle: (id: string, field: string, value: boolean) => void,
) => {
  switch (selectedMenu) {
    case "docs":
      return docsBody({ user, handleToggle });
    case "videos":
      return videosBody({ user, handleToggle });
    case "apps-tds":
      return appsTdsBody({ user, handleToggle });
    case "apps-cogeco":
      return appsCogecoBody({ user, handleToggle });
    case "apps-vistabeam":
      return appsVistabeamBody({ user, handleToggle });
    case "apps-xplore":
      return appsXploreBody({ user, handleToggle });
    default:
      return defaultBody({ user, handleToggle, isAdmin });
  }
};
