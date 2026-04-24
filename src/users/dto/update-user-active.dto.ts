import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateActiveUserBodySchema = z.object({
  active: z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (val === 'true') return true;
    if (val === 'false') return false;
  }, z.boolean()),
  company_id: z.string(),
});

class UpdateUserActiveDto extends createZodDto(updateActiveUserBodySchema) {}

export { updateActiveUserBodySchema, UpdateUserActiveDto };
