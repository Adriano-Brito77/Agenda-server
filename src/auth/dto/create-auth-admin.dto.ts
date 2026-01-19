import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthAdminBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

class CreateAuthAdminDto extends createZodDto(createAuthAdminBodySchema) {}

export { createAuthAdminBodySchema, CreateAuthAdminDto };
