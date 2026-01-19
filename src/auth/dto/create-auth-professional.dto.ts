import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthProfessionalBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

class CreateAuthProfessionalDto extends createZodDto(
  createAuthProfessionalBodySchema,
) {}

export { createAuthProfessionalBodySchema, CreateAuthProfessionalDto };
