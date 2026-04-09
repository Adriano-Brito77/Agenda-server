import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  barcode: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().min(1),
  company_id: z.string(),
});

class UpdateProductDto extends createZodDto(updateProductBodySchema) {}

export { updateProductBodySchema, UpdateProductDto };
