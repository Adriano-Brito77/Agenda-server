/*
  Warnings:

  - You are about to drop the column `user_id` on the `company_users` table. All the data in the column will be lost.
  - Added the required column `professional_id` to the `company_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "company_users" DROP CONSTRAINT "company_users_user_id_fkey";

-- AlterTable
ALTER TABLE "company_users" DROP COLUMN "user_id",
ADD COLUMN     "professional_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "company_users" ADD CONSTRAINT "company_users_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
