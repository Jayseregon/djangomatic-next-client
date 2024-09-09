export interface UserSchema {
  email: string;
  name: string;
  isAdmin: boolean;
  canAccessAppsTdsHLD: boolean;
  canAccessAppsTdsLLD: boolean;
  canAccessAppsTdsArcGIS: boolean;
  canAccessAppsTdsOverride: boolean;
  canAccessAppsTdsAdmin: boolean;
  canAccessAppsTdsSuper: boolean;
  canAccessAppsCogecoHLD: boolean;
  canAccessAppsVistabeamHLD: boolean;
  canAccessAppsVistabeamOverride: boolean;
  canAccessAppsVistabeamSuper: boolean;
  canAccessAppsXploreAdmin: boolean;
  canAccessBoards: boolean;
  canAccessRnd: boolean;
  canAccessDocsTDS: boolean;
  canAccessDocsCogeco: boolean;
  canAccessDocsVistabeam: boolean;
  canAccessDocsXplore: boolean;
  canAccessVideoDefault: boolean;
  canAccessVideoQGIS: boolean;
  canAccessVideoSttar: boolean;
}

export async function fetchUser(email: string) {
  const response = await fetch("/api/prisma-user-perms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
}
