import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createSchedulesBodySchema = z.object({
  date: z.coerce.date(),
  start_time: z.string(),
  end_time: z.string(),
  notes: z.string().optional(),
  is_paid: z.boolean(),
  notification: z.boolean(),
  status: z.enum(['APPROVED', 'PENDING', 'COMPLETED', 'CANCELED'], {
    message: 'Status must be one of: APPROVED, PENDING, COMPLETED, CANCELED',
  }),
  client_id: z.string(),
  professional_id: z.string().optional(),
  professional_service_id: z.string(),
  company_id: z.string(),
});

class CreateScheduleDto extends createZodDto(createSchedulesBodySchema) {
  user_id: string;
}

export { CreateScheduleDto, createSchedulesBodySchema };
