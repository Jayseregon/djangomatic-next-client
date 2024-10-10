/*
  Warnings:

  - Added the required column `assigned_peng` to the `TowerReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReport" ADD COLUMN     "assigned_peng" TEXT NOT NULL;
