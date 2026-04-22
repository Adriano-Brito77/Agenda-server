import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email(),
    cpf: z.string().length(11, 'CPF must be exactly 11 characters long'),
    role: z.enum(['USER', 'BUSINESS', 'PROFESSIONAL'], {
      message: 'Role must be either "USER", "BUSINESS", or "PROFESSIONAL"',
    }),
    company_id: z.string().optional().nullable(),
    phone_number: z.string().min(10).max(15).optional().nullable(),
    notification_time: z.number().optional(),
    occupation: z.string().optional().nullable(),
    birth_day: z.coerce.date().optional().nullable(),

    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters long',
    }),

    company: z
      .object({
        name: z.string().min(1, 'Company name is required'),
        cnpj: z.string().length(14, 'CNPJ must be exactly 14 characters long'),
        open_date: z.coerce.date(),
        phone_number: z.string().min(10).max(15),
        start_time: z
          .string()
          .min(5)
          .max(5, 'Start time must be in HH:mm format'),
        end_time: z.string().min(5).max(5, 'End time must be in HH:mm format'),
        address: z.string().min(1, 'Address is required'),
        cep: z.string().min(1, 'CEP is required'),
        number: z.string().min(1, 'Number is required'),
        complement: z.string().min(1, 'Complement is required'),
      })
      .optional()
      .nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine((data, ctx) => {
    if (data.role === 'PROFESSIONAL' && !data.company_id) {
      ctx.addIssue({
        code: 'custom',
        message: 'company_id is required for professionals',
      });
    }

    if (data.role === 'BUSINESS' && !data.company) {
      ctx.addIssue({
        code: 'custom',
        message: 'company information is required for business users',
      });
    }
  });

class CreateUserDto extends createZodDto(createUserBodySchema) {}

export { createUserBodySchema, CreateUserDto };
