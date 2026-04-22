import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthBodySchema = z.object({
  cpfemail: z.string(),
  password: z.string(),
  role: z.enum(['USER', 'BUSINESS', 'PROFESSIONAL']),
});

class CreateAuthDto extends createZodDto(createAuthBodySchema) {}

export { createAuthBodySchema, CreateAuthDto };
