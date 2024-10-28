/*
  Warnings:

  - You are about to drop the column `owner` on the `RnDTeamTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RnDTeamTask" DROP COLUMN "owner",
ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "RnDTeamTask" ADD CONSTRAINT "RnDTeamTask_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
