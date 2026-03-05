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
  createProfessionalScheduleBodySchema,
  CreateProfessionalScheduleDto,
} from './dto/create-professional-schedule.dto';
import {
  updateProfessionalScheduleBodySchema,
  UpdateProfessionalScheduleDto,
} from './dto/update-professional-schedule.dto';
import { ProfessionalSchedulesService } from './professional-schedules.service';

@Controller('professional-schedules')
@UseGuards(JwtGuard)
export class ProfessionalSchedulesController {
  constructor(
    private readonly professionalSchedulesService: ProfessionalSchedulesService,
  ) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProfessionalScheduleBodySchema))
    createProfessionalScheduleDto: CreateProfessionalScheduleDto,
  ) {
    return this.professionalSchedulesService.create(
      createProfessionalScheduleDto,
    );
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.professionalSchedulesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalSchedulesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProfessionalScheduleBodySchema))
    updateProfessionalScheduleDto: UpdateProfessionalScheduleDto,
  ) {
    return this.professionalSchedulesService.update(
      id,
      updateProfessionalScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalSchedulesService.remove(id);
  }
}
