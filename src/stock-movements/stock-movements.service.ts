import { Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';

@Injectable()
export class StockMovementsService {
  create(userId: string, createStockMovementDto: CreateStockMovementDto) {
    return 'This action adds a new stockMovement';
  }

  findAll() {
    return `This action returns all stockMovements`;
  }

  findOne(id: string) {
    return `This action returns a #${id} stockMovement`;
  }

  update(
    id: string,
    updateStockMovementDto: UpdateStockMovementDto,
    userId: string,
  ) {
    return `This action updates a #${id} stockMovement`;
  }

  remove(id: string, userId: string) {
    return `This action removes a #${id} stockMovement`;
  }
}
