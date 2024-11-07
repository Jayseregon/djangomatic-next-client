import { TableHeader, TableColumn } from "@nextui-org/react";

/**
 * Renders the default table header.
 *
 * @returns {JSX.Element} The rendered default table header.
 */
export const defaultHeader = ({
  isAdmin,
}: {
  isAdmin: boolean;
}): JSX.Element => {
  if (isAdmin) {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="log" className="w-56">
          last login
        </TableColumn>
        <TableColumn key="admin">admin</TableColumn>
        <TableColumn key="rndTeam">r&amp;d team</TableColumn>
        <TableColumn key="boards">boards</TableColumn>
        <TableColumn key="rnd">r&amp;d</TableColumn>
        <TableColumn key="reports">reports</TableColumn>
      </TableHeader>
    );
  }

  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="log" className="w-56">
        last login
      </TableColumn>
      <TableColumn key="admin">admin</TableColumn>
      <TableColumn key="boards">boards</TableColumn>
      <TableColumn key="rnd">r&amp;d</TableColumn>
      <TableColumn key="reports">reports</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the docs table header.
 *
 * @returns {JSX.Element} The rendered docs table header.
 */
export const docsHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="docs1">tds</TableColumn>
      <TableColumn key="docs2">cogeco</TableColumn>
      <TableColumn key="docs3">vistabeam</TableColumn>
      <TableColumn key="docs4">xplore</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the videos table header.
 *
 * @returns {JSX.Element} The rendered videos table header.
 */
export const videosHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="videos1">admin</TableColumn>
      <TableColumn key="videos2">gis</TableColumn>
      <TableColumn key="videos3">cad</TableColumn>
      <TableColumn key="videos4">lidar</TableColumn>
      <TableColumn key="videos5">eng</TableColumn>
      <TableColumn key="videos6">sttar</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps TDS table header.
 *
 * @returns {JSX.Element} The rendered apps TDS table header.
 */
export const appsTdsHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="tds1">hld</TableColumn>
      <TableColumn key="tds2">lld</TableColumn>
      <TableColumn key="tds3">arcgis</TableColumn>
      <TableColumn key="tds4">ovr</TableColumn>
      <TableColumn key="tds5">admin</TableColumn>
      <TableColumn key="tds6">super</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps COGECO table header.
 *
 * @returns {JSX.Element} The rendered apps COGECO table header.
 */
export const appsCogecoHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="cog1">hld</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps Vistabeam table header.
 *
 * @returns {JSX.Element} The rendered apps Vistabeam table header.
 */
export const appsVistabeamHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="vista1">hld</TableColumn>
      <TableColumn key="vista2">ovr</TableColumn>
      <TableColumn key="vista3">super</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps Xplore table header.
 *
 * @returns {JSX.Element} The rendered apps Xplore table header.
 */
export const appsXploreHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="xplore1">admin</TableColumn>
    </TableHeader>
  );
};

export const renderTableHeader = (selectedMenu: string, isAdmin: boolean) => {
  switch (selectedMenu) {
    case "docs":
      return docsHeader();
    case "videos":
      return videosHeader();
    case "apps-tds":
      return appsTdsHeader();
    case "apps-cogeco":
      return appsCogecoHeader();
    case "apps-vistabeam":
      return appsVistabeamHeader();
    case "apps-xplore":
      return appsXploreHeader();
    default:
      return defaultHeader({ isAdmin });
  }
};
