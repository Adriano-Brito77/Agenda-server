import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateCompanyServiceBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  company_id: z.string(),
});

class UpdateCompanyServiceDto extends createZodDto(
  updateCompanyServiceBodySchema,
) {}

export { updateCompanyServiceBodySchema, UpdateCompanyServiceDto };
