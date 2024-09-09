"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

import { CheckIcon, UncheckIcon } from "@/components/icons";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  isAdmin: boolean;
  isUser: boolean;
  canAccessApps: boolean;
  canAccessBoards: boolean;
  canAccessRnd: boolean;
  canAccessDocs: boolean;
}

interface PermissionSwitchProps {
  user: any;
  fieldName: string;
  borderType?: string;
  handleToggle: (id: string, field: string, value: boolean) => void;
}

// const checkbox = tv({
//   slots: {
//     base: "hover:bg-foreground",
//     content: "text-red-800",
//   },
//   variants: {
//     isSelected: {
//       true: {
//         base: "bg-success hover:bg-success-300",
//         content: "text-green-800",
//       },
//     },
//     isFocusVisible: {
//       true: {
//         base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
//       },
//     },
//   },
// });

// export const PermissionSwitch = ({
//   user,
//   fieldName,
//   borderType,
//   handleToggle,
// }: PermissionSwitchProps) => {
//   const { isSelected, isFocusVisible, getBaseProps, getInputProps } =
//     useCheckbox({
//       isSelected: user[fieldName],
//       onChange: (e) => handleToggle(user.id, fieldName, e.target.checked),
//     });

//   const styles = checkbox({ isSelected, isFocusVisible });

//   return (
//     <td
//       {...getBaseProps()}
//       className={`ps-1 cursor-pointer border ${borderType} border-foreground ${styles.base()}`}
//       onClick={() => handleToggle(user.id, fieldName, !isSelected)}
//     >
//       <VisuallyHidden>
//         <input {...getInputProps()} />
//       </VisuallyHidden>
//       <div className={`flex justify-center items-center ${styles.content()}`}>
//         {isSelected ? <CheckIcon /> : <UncheckIcon />}
//       </div>
//     </td>
//   );
// };

export const PermissionButton = ({
  user,
  fieldName,
  handleToggle,
}: PermissionSwitchProps) => {
  return (
    <Button
      isIconOnly
      className="ps-0.5 pt-0.5"
      color={user[fieldName] ? "success" : "danger"}
      radius="full"
      size="sm"
      variant="light"
      onClick={() => handleToggle(user.id, fieldName, !user[fieldName])}
    >
      {user[fieldName] ? <CheckIcon size={24} /> : <UncheckIcon size={24} />}
    </Button>
  );
};

export const VerticalText = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-2">
      {text.split("").map((char, index) => (
        <div key={index}>{char}</div>
      ))}
    </div>
  );
};

// export const OldUserTable = () => {
//   const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch("/api/prisma-users");
//         const data = await response.json();

//         setUsers(data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     }
//     fetchData();
//   }, []);

//   const handleToggle = async (id: string, field: string, value: boolean) => {
//     try {
//       const response = await fetch("/api/prisma-user-update", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id,
//           [field]: value,
//         }),
//       });

//       if (response.ok) {
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === id ? { ...user, [field]: value } : user,
//           ),
//         );
//       } else {
//         console.error("Failed to update user");
//       }
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     }
//   };

//   return (
//     <div className="mt-10 w-full">
//       <div className="overflow-x-auto">
//         <table className="min-w-screen border border-foreground">
//           <thead>
//             <tr className="border border-foreground uppercase">
//               <th rowSpan={3}>email</th>
//               <th rowSpan={3}>username</th>
//               <th rowSpan={3}>log</th>
//               <th className="border border-x-4 border-foreground" rowSpan={3}>
//                 <VerticalText text="admin" />
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={11}
//               >
//                 Apps
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={4}
//                 rowSpan={2}
//               >
//                 docs
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={3}
//                 rowSpan={2}
//               >
//                 videos
//               </th>
//               <th className="border border-r-4 border-foreground" rowSpan={3}>
//                 <VerticalText text="boards" />
//               </th>
//               <th className="border border-r-4 border-foreground" rowSpan={3}>
//                 <VerticalText text="R&amp;D" />
//               </th>
//             </tr>
//             <tr className="uppercase">
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={6}
//               >
//                 TDS
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={1}
//               >
//                 COGECO
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={3}
//               >
//                 Vistabeam
//               </th>
//               <th
//                 className="px-2 border border-x-4 border-foreground"
//                 colSpan={1}
//               >
//                 Xplore
//               </th>
//             </tr>
//             <tr className="uppercase">
//               <th className="border border-foreground">
//                 <VerticalText text="HLD" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="LLD" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="ArcGIS" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Ovr" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Admin" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Super" />
//               </th>
//               <th className="border border-x-4 border-foreground">
//                 <VerticalText text="HLD" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="HLD" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Ovr" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Super" />
//               </th>
//               <th className="border border-x-4 border-foreground">
//                 <VerticalText text="Admin" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="TDS" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Cogeco" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="Vistabeam" />
//               </th>
//               <th className="border border-r-4 border-foreground">
//                 <VerticalText text="Xplore" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="default" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="qgis" />
//               </th>
//               <th className="border border-foreground">
//                 <VerticalText text="sttar" />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.id} className="border border-foreground">
//                   <td className="p-2">{user.email}</td>
//                   <td className="p-2">{user.name}</td>
//                   <td className="p-2">
//                     {/* {new Date(user.createdAt).toLocaleDateString()} | {new Date(user.lastLogin).toLocaleString()} */}
//                     {new Date(user.lastLogin).toLocaleDateString()}
//                   </td>
//                   <PermissionSwitch
//                     borderType="border-x-4"
//                     fieldName="isAdmin"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsHLD"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsLLD"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsArcGIS"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsOverride"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsAdmin"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsTdsSuper"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     borderType="border-x-4"
//                     fieldName="canAccessAppsCogecoHLD"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsVistabeamHLD"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsVistabeamOverride"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessAppsVistabeamSuper"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     borderType="border-x-4"
//                     fieldName="canAccessAppsXploreAdmin"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessDocsTDS"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessDocsCogeco"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessDocsVistabeam"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     borderType="border-r-4"
//                     fieldName="canAccessDocsXplore"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessVideoDefault"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessVideoQGIS"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     fieldName="canAccessVideoSttar"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     borderType="border-x-4"
//                     fieldName="canAccessBoards"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                   <PermissionSwitch
//                     borderType="border-r-4"
//                     fieldName="canAccessRnd"
//                     handleToggle={handleToggle}
//                     user={user}
//                   />
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   className="py-2 px-4 border border-foreground text-center min-w-screen"
//                   colSpan={25}
//                 >
//                   No entries found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

export const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("default");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/prisma-users");
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, []);

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      const response = await fetch("/api/prisma-user-update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          [field]: value,
        }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, [field]: value } : user,
          ),
        );
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const topContent = () => {
    return (
      <div className="flex inline-block uppercase text-center gap-4 divide-x divide-zinc-300 dark:divide-zinc-700">
        <RadioGroup
          aria-label="default-menu"
          label="Default permissions"
          orientation="horizontal"
          value={selectedMenu}
          onValueChange={setSelectedMenu}
        >
          <Radio value="default">Default</Radio>
          <Radio value="docs">Docs</Radio>
          <Radio value="videos">Videos</Radio>
        </RadioGroup>
        <RadioGroup
          aria-label="apps-menu"
          className="ps-3.5"
          label="Apps permissions"
          orientation="horizontal"
          value={selectedMenu}
          onValueChange={setSelectedMenu}
        >
          <Radio value="apps-tds">TDS</Radio>
          <Radio value="apps-cogeco">COGECO</Radio>
          <Radio value="apps-vistabeam">Vistabeam</Radio>
          <Radio value="apps-xplore">Xplore</Radio>
        </RadioGroup>
      </div>
    );
  };

  const defaultHeader = () => {
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
      </TableHeader>
    );
  };

  const defaultBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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
      </TableRow>
    );
  };

  const docsHeader = () => {
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

  const docsBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  const videosHeader = () => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="videos1">default</TableColumn>
        <TableColumn key="videos2">qgis</TableColumn>
        <TableColumn key="videos3">sttar</TableColumn>
      </TableHeader>
    );
  };

  const videosBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  const appsTdsHeader = () => {
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

  const appsTdsBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  const appsCogecoHeader = () => {
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

  const appsCogecoBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  const appsVistabeamHeader = () => {
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

  const appsVistabeamBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  const appsXploreHeader = () => {
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

  const appsXploreBody = ({ user }: { user: User }) => {
    return (
      <TableRow key={user.id}>
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

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="user-perms-table"
          classNames={{
            base: "text-left",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectionMode="single"
          topContent={topContent()}
        >
          {selectedMenu === "default"
            ? defaultHeader()
            : selectedMenu === "docs"
              ? docsHeader()
              : selectedMenu === "videos"
                ? videosHeader()
                : selectedMenu === "apps-tds"
                  ? appsTdsHeader()
                  : selectedMenu === "apps-cogeco"
                    ? appsCogecoHeader()
                    : selectedMenu === "apps-vistabeam"
                      ? appsVistabeamHeader()
                      : appsXploreHeader()}
          <TableBody emptyContent="No entries found" items={users}>
            {(user) =>
              selectedMenu === "default"
                ? defaultBody({ user })
                : selectedMenu === "docs"
                  ? docsBody({ user })
                  : selectedMenu === "videos"
                    ? videosBody({ user })
                    : selectedMenu === "apps-tds"
                      ? appsTdsBody({ user })
                      : selectedMenu === "apps-cogeco"
                        ? appsCogecoBody({ user })
                        : selectedMenu === "apps-vistabeam"
                          ? appsVistabeamBody({ user })
                          : appsXploreBody({ user })
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
