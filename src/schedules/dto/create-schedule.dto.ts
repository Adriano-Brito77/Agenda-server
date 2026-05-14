import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createSchedulesBodySchema = z.object({
  date: z.coerce.date(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: z.string().optional(),
  client_name_external: z.string().optional(),
  client_email_external: z.string().optional(),
  number: z.string().min(1, { message: 'Number is required' }),
  client_id: z.string().optional().nullable(),
  professional_id: z
    .string()
    .min(1, { message: 'Professional ID is required' }),
  professional_service_id: z
    .array(z.string())
    .min(1, { message: 'At least one professional service ID is required' }),
  company_id: z.string().min(1, { message: 'Company ID is required' }),
});

class CreateScheduleDto extends createZodDto(createSchedulesBodySchema) {
  creator_id: string;
}

export { CreateScheduleDto, createSchedulesBodySchema };
