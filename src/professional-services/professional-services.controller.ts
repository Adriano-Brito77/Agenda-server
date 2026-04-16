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
  createProfessionalServiceBodySchema,
  CreateProfessionalServiceDto,
} from './dto/create-professional-service.dto';
import { UpdateProfessionalServiceDto } from './dto/update-professional-service.dto';
import { ProfessionalServicesService } from './professional-services.service';

@Controller('professional-services')
@UseGuards(JwtGuard)
export class ProfessionalServicesController {
  constructor(
    private readonly professionalServicesService: ProfessionalServicesService,
  ) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createProfessionalServiceBodySchema))
    createProfessionalServiceDto: CreateProfessionalServiceDto,
  ) {
    return this.professionalServicesService.create(
      createProfessionalServiceDto,
    );
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.professionalServicesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionalServicesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfessionalServiceDto: UpdateProfessionalServiceDto,
  ) {
    return this.professionalServicesService.update(
      id,
      updateProfessionalServiceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalServicesService.remove(id);
  }
}
