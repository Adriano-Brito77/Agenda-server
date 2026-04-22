import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCompaniesBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email(),
  open_date: z.string().transform((val) => new Date(val)),
  cnpj: z.string().min(14),
  phone_number: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  address: z.string(),
  cep: z.string(),
  number: z.string(),
  complement: z.string(),
});

class CreateCompanyDto extends createZodDto(createCompaniesBodySchema) {
  creator_id: string;
}

export { createCompaniesBodySchema, CreateCompanyDto };
