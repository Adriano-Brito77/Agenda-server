/*
  Warnings:

  - You are about to drop the column `user_id` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `creator_id` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_user_id_fkey";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "user_id",
ADD COLUMN     "creator_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
