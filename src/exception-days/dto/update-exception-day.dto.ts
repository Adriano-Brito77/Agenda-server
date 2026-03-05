import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateExceptionDayBodySchema = z.object({
  professional_id: z.string().optional().nullable(),
  company_id: z.string(),
  date: z
    .string({ message: 'A data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido')
    .transform((date) => new Date(date)),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time is required')
    .optional()
    .nullable(),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time is invalid')
    .optional()
    .nullable(),
});

class UpdateExceptionDayDto extends createZodDto(
  updateExceptionDayBodySchema,
) {}

export { updateExceptionDayBodySchema, UpdateExceptionDayDto };
