import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, PrismaService, PaginationService],
})
export class PurchaseOrdersModule {}
