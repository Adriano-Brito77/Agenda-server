import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import no from 'zod/v4/locales/no.js';

const createUserBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email(),
    cpf: z.string().length(11, 'CPF must be exactly 11 characters long'),
    role: z.enum(['user', 'admin', 'professional'], {
      message: 'Role must be either "user", "admin", or "professional"',
    }),
    company_id: z.string().optional().nullable(),
    phone_number: z.string().min(10).max(15),
    notification_time: z.number().optional(),
    occupation: z.string().optional().nullable(),
    birth_day: z
      .string()
      .transform((val) => new Date(val))
      .optional()
      .nullable(),

    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters long',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.role === 'professional' && !data.company_id) {
      ctx.addIssue({
        code: 'custom',
        message: 'Company ID is required for professionals',
      });
    }
  });

class CreateUserDto extends createZodDto(createUserBodySchema) {}

export { createUserBodySchema, CreateUserDto };
