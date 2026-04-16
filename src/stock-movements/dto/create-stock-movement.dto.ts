import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createStockMovementBodySchema = z.array(
  z
    .object({
      type: z.enum(['IN', 'OUT']),
      reference_type: z.enum(['PURCHASE', 'ENTRY', 'SALE', 'STOCK_OUT']),
      quantity: z.number(),
      unit_price: z.number(),
      total_value: z.number(),
      movement_date: z
        .string({ message: 'A data é obrigatória' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido')
        .transform((date) => new Date(date)),
      purchase_order_id: z.string().optional(),
      product_id: z.string(),
    })
    .superRefine((data, ctx) => {
      const isPurchaseIn =
        data.type === 'IN' &&
        data.reference_type !== 'PURCHASE' &&
        data.reference_type !== 'ENTRY';

      const isSaleOut =
        data.type === 'OUT' &&
        data.reference_type !== 'SALE' &&
        data.reference_type !== 'STOCK_OUT';

      if (isPurchaseIn) {
        ctx.addIssue({
          code: 'custom',
          path: ['reference_type'],
          message: 'Tipo de referência inválido para entrada',
        });
      }

      if (isSaleOut) {
        ctx.addIssue({
          code: 'custom',
          path: ['reference_type'],
          message: 'Tipo de referência inválido para saída',
        });
      }

      if (data.reference_type === 'SALE' && !data.purchase_order_id) {
        ctx.addIssue({
          code: 'custom',
          path: ['purchase_order_id'],
          message: 'ID do pedido de compra é obrigatório para vendas',
        });
      }
    }),
);
class CreateStockMovementDto extends createZodDto(
  createStockMovementBodySchema,
) {}

export { createStockMovementBodySchema, CreateStockMovementDto };
