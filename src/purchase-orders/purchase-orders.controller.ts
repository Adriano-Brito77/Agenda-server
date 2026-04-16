import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Controller('purchase-orders')
@UseGuards(JwtGuard)
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreatePurchaseOrderDto))
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Get('/company')
  findByCompany(@Query() paginationDto: PaginationDto) {
    return this.purchaseOrdersService.findByCompany(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(id);
  }
}
