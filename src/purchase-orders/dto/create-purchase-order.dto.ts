import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPurchaseOrderBodySchema = z.object({
  company_id: z.string(),
  order_amount: z.number(),
  order_date: z.coerce.date(),
  requester_name: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELED'], {
    message: 'Status must be one of PENDING, APPROVED, REJECTED, CANCELED',
  }),
  payment_method: z.string(),
  pickup_date: z.coerce.date().optional(),
  itens: z.array(
    z.object({
      product_id: z.string(),
      name: z.string(),
      quantity: z.number(),
      unit_price: z.number(),
      total_value: z.number(),
    }),
  ),
});

class CreatePurchaseOrderDto extends createZodDto(
  createPurchaseOrderBodySchema,
) {}

export { CreatePurchaseOrderDto, createPurchaseOrderBodySchema };
