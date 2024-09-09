-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessAppsCogecoHLD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsArcGIS" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsHLD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsLLD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsOverride" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsTdsSuper" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsVistabeamHLD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsVistabeamOverride" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessAppsVistabeamSuper" BOOLEAN NOT NULL DEFAULT false;
