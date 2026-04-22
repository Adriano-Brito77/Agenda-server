/*
  Warnings:

  - The values [user,admin,professional] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusSchedule" AS ENUM ('APPROVED', 'COMPLETED', 'CANCELED', 'PENDING');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN', 'PROFESSIONAL');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "notes" TEXT;

-- CreateIndex
CREATE INDEX "schedules_professional_id_start_time_end_time_idx" ON "schedules"("professional_id", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "schedules_company_id_start_time_idx" ON "schedules"("company_id", "start_time");
