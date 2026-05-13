/*
  Warnings:

  - You are about to drop the column `date` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `schedules_id` on the `scheduleservices` table. All the data in the column will be lost.
  - Added the required column `duration_in_minutes` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ends_at` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starts_at` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_id` to the `scheduleservices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedules_company_id_start_time_idx";

-- DropIndex
DROP INDEX "schedules_professional_id_start_time_end_time_idx";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "date",
DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "duration_in_minutes" INTEGER NOT NULL,
ADD COLUMN     "ends_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "starts_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "scheduleservices" DROP COLUMN "schedules_id",
ADD COLUMN     "schedule_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "schedules_professional_id_starts_at_ends_at_idx" ON "schedules"("professional_id", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "schedules_company_id_starts_at_idx" ON "schedules"("company_id", "starts_at");
