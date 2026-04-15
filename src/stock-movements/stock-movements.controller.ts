import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import {
  createStockMovementBodySchema,
  CreateStockMovementDto,
} from './dto/create-stock-movement.dto';
import { StockMovementsService } from './stock-movements.service';

@Controller('stock-movements')
@UseGuards(JwtGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createStockMovementBodySchema))
    createStockMovementDto: CreateStockMovementDto,
  ) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Get('/company')
  findByAllStockBalance(@Query() pagination: PaginationDto) {
    return this.stockMovementsService.findByAllStockBalance(pagination);
  }

  @Get('product/:id')
  findByProductId(@Param('id') id: string) {
    return this.stockMovementsService.findByProductId(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(id);
  }
}
