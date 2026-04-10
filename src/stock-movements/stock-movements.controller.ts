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
import {
  createStockMovementBodySchema,
  CreateStockMovementDto,
} from './dto/create-stock-movement.dto';
import {
  updateStockMovementBodySchema,
  UpdateStockMovementDto,
} from './dto/update-stock-movement.dto';
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
  findAll(@Query() pagination: PaginationDto) {
    return this.stockMovementsService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStockMovementBodySchema))
    updateStockMovementDto: UpdateStockMovementDto,
  ) {
    return this.stockMovementsService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(id);
  }
}
