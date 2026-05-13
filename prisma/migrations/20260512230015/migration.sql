/*
  Warnings:

  - Changed the type of `status` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_client_id_fkey";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "status",
ADD COLUMN     "status" "StatusSchedule" NOT NULL,
ALTER COLUMN "client_id" DROP NOT NULL;
