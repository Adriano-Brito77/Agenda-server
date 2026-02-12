import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createProfessionalServiceBodySchema = z.object({
  value: z.number().positive(),
  description: z.string().min(1),
  duration: z.number().min(1),
  company_id: z.string(),
  company_service_id: z.string(),
  professional_id: z.string(),
});

class CreateProfessionalServiceDto extends createZodDto(
  createProfessionalServiceBodySchema,
) {}

export { createProfessionalServiceBodySchema, CreateProfessionalServiceDto };
