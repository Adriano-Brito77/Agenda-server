/*
  Warnings:

  - You are about to drop the column `user_id` on the `companies` table. All the data in the column will be lost.
  - Added the required column `cep` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "user_id",
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_days" ADD CONSTRAINT "exception_days_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
