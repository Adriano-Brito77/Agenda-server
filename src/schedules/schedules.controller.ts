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
import { SchedulesService } from './schedules.service';
import {
  CreateScheduleDto,
  createSchedulesBodySchema,
} from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtGuard } from '../auth/jwt/jwt-guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser, type AuthUser } from '../auth/jwt/current-user';
import { PaginationDto } from '../pagination/dto/pagination.dto';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
