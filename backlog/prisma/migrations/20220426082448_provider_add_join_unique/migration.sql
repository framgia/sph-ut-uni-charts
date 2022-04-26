/*
  Warnings:

  - A unique constraint covering the columns `[user_id,api_key]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Provider_user_id_api_key_key" ON "Provider"("user_id", "api_key");
