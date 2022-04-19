/*
  Warnings:

  - You are about to drop the column `project_key` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `client_secret` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Provider` table. All the data in the column will be lost.
  - Added the required column `key` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `api_key` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "project_key",
ADD COLUMN "key" TEXT NOT NULL,
ADD COLUMN "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "access_token",
DROP COLUMN "client_id",
DROP COLUMN "client_secret",
DROP COLUMN "refresh_token",
ADD COLUMN "api_key" TEXT NOT NULL;
