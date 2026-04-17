import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async create({
    company_id,
    order_amount,
    order_date,
    requester_name,
    status,
    payment_method,
    pickup_date,
    itens,
  }: CreatePurchaseOrderDto) {
    return this.prisma.$transaction(async (prisma) => {
      const companyExists = await prisma.company.findUnique({
        where: { id: company_id },
      });
      if (!companyExists) {
        throw new NotFoundException(`Empresa não encontrada`);
      }

      const itensExists = await prisma.products.findMany({
        where: {
          id: { in: itens.map((item) => item.product_id) },
        },
      });

      if (itensExists.length !== itens.length) {
        throw new NotFoundException(`Um ou mais produtos não encontrados`);
      }

      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          company_id,
          order_amount,
          order_date,
          requester_name,
          status,
          payment_method,
          pickup_date,
        },
      });

      await prisma.orderItem.createMany({
        data: itens.map((item) => ({
          purchase_order_id: purchaseOrder.id,
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_value: item.total_value,
        })),
      });
    });
  }

  async findByCompany({
    page,
    pageSize,
    company_id,
    orderBy,
    search,
  }: PaginationDto) {
    if (!company_id) {
      throw new BadRequestException('company_id é obrigatório');
    }

    let where: any = {};

    if (company_id) {
      where = { ...where, company_id };
    }

    if (search) {
      where = {
        ...where,
        OR: [
          { requester_name: { contains: search, mode: 'insensitive' } },
          { payment_method: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const order = orderBy
      ? {
          [orderBy.split(':')[0]]: orderBy.split(':')[1],
        }
      : { created_at: 'desc' };

    const purchaseOrders = await this.paginationService.paginate(
      this.prisma.purchaseOrder,
      {
        where,
        orderBy: order,
        page,
        pageSize,
        include: {
          order_items: true,
        },
      },
    );

    return purchaseOrders;
  }

  async findOne(id: string) {
    const purchaseOrder = await this.prisma.purchaseOrder.findUnique({
      where: { id: id },
      include: {
        order_items: true,
      },
    });
    if (!purchaseOrder) {
      throw new NotFoundException(`Pedido de compra não encontrado`);
    }
    return purchaseOrder;
  }

  async update(
    id: string,
    {
      order_amount,
      order_date,
      requester_name,
      status,
      payment_method,
      pickup_date,
      itens,
    }: UpdatePurchaseOrderDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      /* valida se o pedido de compra existe */
      await this.findOne(id);

      /* valida se o produto existe*/
      const itensExists = await prisma.products.findMany({
        where: {
          id: { in: itens.map((item) => item.product_id) },
        },
      });

      if (itensExists.length !== itens.length) {
        throw new NotFoundException(`Um ou mais produtos não encontrados`);
      }

      const purchaseOrder = await prisma.purchaseOrder.update({
        where: { id: id },
        data: {
          order_amount,
          order_date,
          requester_name,
          status,
          payment_method,
          pickup_date,
        },
      });
      /* apaga os itens antigos */
      await prisma.orderItem.deleteMany({
        where: {
          purchase_order_id: id,
        },
      });
      /* cria os novos itens */
      await prisma.orderItem.createMany({
        data: itens.map((item) => ({
          purchase_order_id: purchaseOrder.id,
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_value: item.total_value,
        })),
      });
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      /* valida se o pedido de compra existe */
      await this.findOne(id);

      /* apaga os itens antigos */
      await prisma.orderItem.deleteMany({
        where: {
          purchase_order_id: id,
        },
      });

      /* apaga o pedido de compra */
      await prisma.purchaseOrder.delete({
        where: { id: id },
      });
    });
  }
}
