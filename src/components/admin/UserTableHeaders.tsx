import type { JSX } from "react";

import { TableHeader, TableColumn } from "@heroui/react";
import { FileLock } from "lucide-react";

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
        <TableColumn key="Roadmap">Roadmap</TableColumn>
        <TableColumn key="Bugs">Bugs</TableColumn>
        <TableColumn key="rnd">r&amp;d</TableColumn>
        <TableColumn key="chatbot">Chatbot</TableColumn>
        <TableColumn key="setics">Setics</TableColumn>
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
      <TableColumn key="Roadmap">Roadmap</TableColumn>
      <TableColumn key="Bugs">Bugs</TableColumn>
      <TableColumn key="rnd">r&amp;d</TableColumn>
      <TableColumn key="chatbot">Chatbot</TableColumn>
      <TableColumn key="setics">Setics</TableColumn>
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
      <TableColumn key="kc">K-C</TableColumn>
      <TableColumn key="kc-secure" className="inline-flex items-center gap-1">
        K-C <FileLock size={16} />
      </TableColumn>
      <TableColumn key="admin">admin</TableColumn>
      <TableColumn key="cogeco">cogeco</TableColumn>
      <TableColumn key="comcast">comcast</TableColumn>
      <TableColumn key="tds">tds</TableColumn>
      <TableColumn key="vistabeam">vistabeam</TableColumn>
      <TableColumn key="xplore">xplore</TableColumn>
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

export const reportsHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="access">access</TableColumn>
      <TableColumn key="delete">delete</TableColumn>
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
      <TableColumn key="xplore2">hld</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps Telus table header.
 *
 * @returns {JSX.Element} The rendered apps Xplore table header.
 */
export const appsTelusHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="telus1">admin</TableColumn>
    </TableHeader>
  );
};

/**
 * Renders the apps Global table header.
 *
 * @returns {JSX.Element} The rendered apps Global table header.
 */
export const appsGlobalHeader = (): JSX.Element => {
  return (
    <TableHeader>
      <TableColumn key="email" className="w-56">
        email
      </TableColumn>
      <TableColumn key="username" className="w-56">
        username
      </TableColumn>
      <TableColumn key="global1">all</TableColumn>
      <TableColumn key="global2">atlantic</TableColumn>
      <TableColumn key="global3">quebec</TableColumn>
      <TableColumn key="global4">central</TableColumn>
      <TableColumn key="global5">west</TableColumn>
      <TableColumn key="global6">usa</TableColumn>
    </TableHeader>
  );
};

export const renderTableHeader = (selectedMenu: string, isAdmin: boolean) => {
  switch (selectedMenu) {
    case "docs":
      return docsHeader();
    case "videos":
      return videosHeader();
    case "reports":
      return reportsHeader();
    case "apps-global":
      return appsGlobalHeader();
    case "apps-tds":
      return appsTdsHeader();
    case "apps-cogeco":
      return appsCogecoHeader();
    case "apps-vistabeam":
      return appsVistabeamHeader();
    case "apps-xplore":
      return appsXploreHeader();
    case "apps-telus":
      return appsTelusHeader();
    default:
      return defaultHeader({ isAdmin });
  }
};
