/*
  Warnings:

  - You are about to drop the column `notification_time` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `notification` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "notification_time",
ADD COLUMN     "notification" BOOLEAN NOT NULL;
