import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, PaginationService],
})
export class ProductsModule {}
