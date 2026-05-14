/*
  Warnings:

  - You are about to drop the column `professional_service_id` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `value_total_services` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_professional_service_id_fkey";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "professional_service_id",
ADD COLUMN     "value_total_services" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "is_paid" SET DEFAULT false,
ALTER COLUMN "notification" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
