/*
  Warnings:

  - Changed the type of `project_id` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL;
