import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import {
  updatePurchaseOrderBodySchema,
  UpdatePurchaseOrderDto,
} from './dto/update-purchase-order.dto';
import { PurchaseOrdersService } from './purchase-orders.service';

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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePurchaseOrderBodySchema))
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(id);
  }
}
