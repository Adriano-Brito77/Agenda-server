import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createExceptionDayBodySchema = z.object({
  professional_id: z.string().min(1).optional().nullable(),
  company_id: z.string(),
  date: z
    .string({ message: 'A data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido')
    .transform((date) => new Date(date)),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .nullable(),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .nullable(),
});

class CreateExceptionDayDto extends createZodDto(
  createExceptionDayBodySchema,
) {}

export { createExceptionDayBodySchema, CreateExceptionDayDto };
