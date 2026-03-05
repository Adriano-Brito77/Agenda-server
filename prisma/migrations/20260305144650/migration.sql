-- DropForeignKey
ALTER TABLE "exception_days" DROP CONSTRAINT "exception_days_professional_id_fkey";

-- AlterTable
ALTER TABLE "exception_days" ALTER COLUMN "professional_id" DROP NOT NULL;
