/*
  Warnings:

  - Added the required column `number` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "client_email_external" TEXT,
ADD COLUMN     "client_name_external" TEXT,
ADD COLUMN     "number" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "scheduleservices" (
    "id" TEXT NOT NULL,
    "schedules_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "scheduleservices_pkey" PRIMARY KEY ("id")
);
