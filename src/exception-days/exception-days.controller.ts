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
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import {
  createExceptionDayBodySchema,
  CreateExceptionDayDto,
} from './dto/create-exception-day.dto';
import {
  updateExceptionDayBodySchema,
  UpdateExceptionDayDto,
} from './dto/update-exception-day.dto';
import { ExceptionDaysService } from './exception-days.service';

@Controller('exception-days')
@UseGuards(JwtGuard)
export class ExceptionDaysController {
  constructor(private readonly exceptionDaysService: ExceptionDaysService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createExceptionDayBodySchema))
    createExceptionDayDto: CreateExceptionDayDto,
  ) {
    return this.exceptionDaysService.create(createExceptionDayDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.exceptionDaysService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exceptionDaysService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateExceptionDayBodySchema))
    updateExceptionDayDto: UpdateExceptionDayDto,
  ) {
    return this.exceptionDaysService.update(id, updateExceptionDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exceptionDaysService.remove(id);
  }
}
