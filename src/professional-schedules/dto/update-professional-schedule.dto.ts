import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateProfessionalScheduleBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email(),
  cpf: z.string().length(11, 'CPF must be exactly 11 characters long'),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters long',
  }),
  company_id: z.string(),
  hire_date: z.coerce.date(),
  day_of_week: z.array(z.number().int().min(0).max(6)),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  break_start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  break_end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

class UpdateProfessionalScheduleDto extends createZodDto(
  updateProfessionalScheduleBodySchema,
) {}

export { updateProfessionalScheduleBodySchema, UpdateProfessionalScheduleDto };
