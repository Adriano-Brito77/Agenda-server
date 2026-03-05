/*
  Warnings:

  - Added the required column `company_id` to the `exception_days` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exception_days" ADD COLUMN     "company_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "exception_days" ADD CONSTRAINT "exception_days_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
