/*
  Warnings:

  - Added the required column `creator_id` to the `company_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company_users" ADD COLUMN     "creator_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "company_users" ADD CONSTRAINT "company_users_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
