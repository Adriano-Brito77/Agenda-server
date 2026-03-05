-- CreateTable
CREATE TABLE "professional_schedules" (
    "id" TEXT NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "break_start_time" TEXT NOT NULL,
    "break_end_time" TEXT NOT NULL,
    "professional_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_days" (
    "id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "professional_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_days_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "professional_schedules" ADD CONSTRAINT "professional_schedules_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_schedules" ADD CONSTRAINT "professional_schedules_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_days" ADD CONSTRAINT "work_days_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
