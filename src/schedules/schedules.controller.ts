import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser, type AuthUser } from '../auth/jwt/current-user';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import {
  CreateScheduleDto,
  createSchedulesBodySchema,
} from './dto/create-schedule.dto';
import {
  UpdateScheduleDto,
  updateSchedulesBodySchema,
} from './dto/update-schedule.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
@UseGuards(JwtGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createSchedulesBodySchema))
    createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.schedulesService.create(createScheduleDto, user.id);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.schedulesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Put(':id')
  updateStatus(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(updateSchedulesBodySchema))
    updateScheduleDto: UpdateScheduleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.schedulesService.updateStatus(id, updateScheduleDto, user.id);
  }
}
