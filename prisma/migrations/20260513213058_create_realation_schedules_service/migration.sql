/*
  Warnings:

  - Added the required column `updated_at` to the `scheduleservices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduleservices" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "scheduleservices" ADD CONSTRAINT "scheduleservices_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduleservices" ADD CONSTRAINT "scheduleservices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "professional_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
