/*
  Warnings:

  - You are about to drop the column `apiEndpoint` on the `ChatInteractionLog` table. All the data in the column will be lost.
  - You are about to drop the column `finishReason` on the `ChatInteractionLog` table. All the data in the column will be lost.
  - You are about to drop the column `toolsCalled` on the `ChatInteractionLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatInteractionLog" DROP COLUMN "apiEndpoint",
DROP COLUMN "finishReason",
DROP COLUMN "toolsCalled";
