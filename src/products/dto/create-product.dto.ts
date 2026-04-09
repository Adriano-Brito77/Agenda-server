import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  barcode: z.string().min(1),
  unit: z.string().min(1),
  company_id: z.string(),
});

class CreateProductDto extends createZodDto(createProductBodySchema) {}

export { createProductBodySchema, CreateProductDto };
