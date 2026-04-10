import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import type { AuthUser } from '../auth/jwt/current-user';
import { CurrentUser } from '../auth/jwt/current-user';
import { JwtGuard } from '../auth/jwt/jwt-guard';
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
    @CurrentUser() user: AuthUser,
  ) {
    return this.stockMovementsService.create(user.id, createStockMovementDto);
  }

  @Get()
  findAll() {
    return this.stockMovementsService.findAll();
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
    @CurrentUser() user: AuthUser,
  ) {
    return this.stockMovementsService.update(
      id,
      updateStockMovementDto,
      user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.stockMovementsService.remove(id, user.id);
  }
}
