import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PrismaService } from '../prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

interface StockMovementResult {
  id: string;
  product_id: string;
  company_id: string;
  quantity: number;
  type: string;
  reference_type: string;
}
export interface StockBalanceMovement {
  data: StockMovementResult[];
  totalcount: number;
  totalpages: number;
  currentpage: number;
}
@Injectable()
export class StockMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    return this.prisma.$transaction(async (prisma) => {
      let productsNotFound: any[] = [];

      for (const movement of createStockMovementDto) {
        /* valida se o produto existe */
        const product = await prisma.products.findUnique({
          where: { id: movement.product_id },
        });
        if (!product) {
          productsNotFound.push(movement);
        }
      }
      /* caso algum produto não seja encontrado, lança uma exceção */
      if (productsNotFound.length > 0) {
        throw new NotFoundException(
          `Produtos não encontrados: ${productsNotFound.map((p) => p.product_id).join(', ')}`,
        );
      }

      /* cria um movimento de estoque no banco de dados */
      await prisma.stockMovements.createMany({
        data: createStockMovementDto.map((movement) => ({
          type: movement.type,
          reference_type: movement.reference_type,
          quantity: movement.quantity,
          unit_price: movement.unit_price,
          total_value: movement.total_value,
          movement_date: movement.movement_date,
          purchase_order_id: movement.purchase_order_id,
          product_id: movement.product_id,
        })),
      });

      /* atualiza o estoque dos produtos */
      for (const movement of createStockMovementDto) {
        /* verifica se ja existe um movimento para o produto */
        const stockExists = await prisma.stock_balance.findFirst({
          where: { product_id: movement.product_id },
        });
        /* caso exista um movimento para o produto, atualiza a quantidade */
        if (stockExists) {
          if (movement.type === 'IN') {
            await prisma.stock_balance.update({
              where: { product_id: movement.product_id },
              data: {
                quantity: stockExists.quantity + movement.quantity,
              },
            });
          }
          if (movement.type === 'OUT') {
            if (stockExists.quantity - movement.quantity < 0) {
              throw new BadRequestException(
                `Quantidade insuficiente em estoque para saida do produto ${movement.product_id}`,
              );
            }
            await prisma.stock_balance.update({
              where: { product_id: movement.product_id },
              data: {
                quantity: stockExists.quantity - movement.quantity,
              },
            });
          }
        }

        /* caso não exista um movimento para o produto, cria um novo */
        if (!stockExists) {
          /* verifica se o movimento é de saída para um produto sem estoque */
          if (movement.type === 'OUT') {
            throw new BadRequestException(
              `Produto ${movement.product_id} não possui estoque para saida`,
            );
          }
          /* cria um novo movimento de estoque para o produto */
          await prisma.stock_balance.create({
            data: {
              product_id: movement.product_id,
              quantity: movement.quantity,
            },
          });
        }
      }
    });
  }

  async findByAllStockBalance({
    page,
    pageSize,
    orderBy,
    search,
    company_id,
  }: PaginationDto) {
    /* valida se o company_id foi fornecido */
    if (!company_id) {
      throw new BadRequestException('company_id é obrigatório');
    }

    const hasSearch = search && search.trim() !== '';

    /* valida os campos permitidos para ordenação */
    const allowedFields = ['created_at', 'reference_type', 'product_name'];

    const [field, direction] = orderBy?.split(':') || [];

    const safeField = allowedFields.includes(field) ? field : 'created_at';
    const safeDirection = direction === 'asc' ? 'ASC' : 'DESC';

    const stock_balance = await this.prisma.$queryRawUnsafe<
      StockBalanceMovement[]
    >(
      `
      SELECT sm.*, p.name as product_name
      FROM stock_balance sm
      JOIN products p ON sm.product_id = p.id  
      WHERE p.company_id = $1
      ${
        hasSearch
          ? `
      AND (
      sm.reference_type ILIKE $2 OR
      sm.type ILIKE $2 OR
      p.name ILIKE $2
        )
        `
          : ''
      }
      ORDER BY ${safeField} ${safeDirection}
      LIMIT $${hasSearch ? 3 : 2}
      OFFSET $${hasSearch ? 4 : 3}
      `,
      ...(hasSearch
        ? [company_id, `%${search}%`, pageSize, (page - 1) * pageSize]
        : [company_id, pageSize, (page - 1) * pageSize]),
    );

    return {
      data: stock_balance,
      totalcount: stock_balance.length,
      totalpages: Math.ceil(stock_balance.length / pageSize),
      currentpage: Number(page),
    };
  }

  async findOne(id: string) {
    /* valida se o movimento de estoque existe */
    const movements = await this.prisma.stockMovements.findUnique({
      where: { id: id },
    });
    if (!movements) {
      throw new NotFoundException(`Movimento de estoque não encontrado`);
    }
    return movements;
  }

  async findByProductId(product_id: string) {
    /* valida se o produto existe */
    const product = await this.prisma.products.findUnique({
      where: { id: product_id },
    });
    if (!product) {
      throw new NotFoundException(
        `Produto com id ${product_id} não encontrado`,
      );
    }
    const stockMovements = await this.prisma.stockMovements.findMany({
      where: { product_id: product_id },
    });
    return stockMovements;
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      /* valida se o movimento de estoque existe */
      const movement = await this.findOne(id);
      console.log(movement);

      /* valida se o saldo de estoque existe */
      const stockBalance = await prisma.stock_balance.findUnique({
        where: { product_id: movement.product_id },
      });
      if (!stockBalance) {
        throw new NotFoundException(
          `Saldo de estoque para o produto ${movement.product_id} não encontrado`,
        );
      }

      if (movement.type === 'IN') {
        if (movement.quantity > stockBalance.quantity) {
          throw new BadRequestException(
            `Não é possível remover o movimento de entrada, pois a quantidade em estoque é menor que a quantidade do movimento quantiade em estoque ${stockBalance.quantity} é menor que a quantidade do movimento ${movement.quantity}`,
          );
        }
        if (movement.quantity === stockBalance.quantity) {
          /* remove o saldo de estoque do produto caso a quantidade do movimento seja igual a quantidade em estoque */
          await prisma.stock_balance.delete({
            where: { product_id: movement.product_id },
          });
        } else {
          /* atualiza o estoque do produto subtraindo a quantidade do movimento de entrada */
          await prisma.stock_balance.update({
            where: { product_id: movement.product_id },
            data: {
              quantity: {
                decrement: movement.quantity,
              },
            },
          });
        }
      }

      if (movement.type === 'OUT') {
        /* atualiza o estoque do produto somando a quantidade do movimento de saída */
        await prisma.stock_balance.update({
          where: { product_id: movement.product_id },
          data: {
            quantity: {
              increment: movement.quantity,
            },
          },
        });
      }
      /* remove o movimento de estoque do banco de dados */
      await prisma.stockMovements.delete({
        where: { id: id },
      });
    });
  }
}
