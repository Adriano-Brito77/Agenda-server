import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { CreateProfessionalServiceDto } from './dto/create-professional-service.dto';
import { UpdateProfessionalServiceDto } from './dto/update-professional-service.dto';

@Injectable()
export class ProfessionalServicesService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}
  async create({
    company_id,
    company_service_id,
    description,
    duration,
    professional_id,
    value,
  }: CreateProfessionalServiceDto) {
    /* valida se a empresa existe*/
    const companyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    /* valida se o serviço da empresa existe*/
    const companyServiceExists = await this.prisma.companyService.findUnique({
      where: { id: company_service_id },
    });
    if (!companyServiceExists) {
      throw new NotFoundException('Serviço da empresa não encontrado');
    }

    /* valida se o profissional existe*/
    const professionalExists = await this.prisma.companyUser.findUnique({
      where: { id: professional_id, company_id },
    });
    if (!professionalExists) {
      throw new NotFoundException('Profissional não encontrado');
    }

    await this.prisma.professionalService.create({
      data: {
        company_id,
        company_service_id,
        description,
        duration,
        professional_id,
        value,
      },
    });
  }

  async findAll({ page, pageSize, orderBy, search }: PaginationDto) {
    const where = search
      ? {
          OR: [
            { description: { contains: search, mode: 'insensitive' } },
            { company: { name: { contains: search, mode: 'insensitive' } } },
            {
              companyService: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }
      : {};

    const order = orderBy
      ? {
          [orderBy.field]: orderBy.direction,
        }
      : {};

    const professionalServices = await this.paginationService.paginate(
      this.prisma.professionalService,
      {
        where,
        orderBy: order,
        page,
        pageSize,
      },
    );
    return professionalServices;
  }

  async findOne(id: string) {
    const professionalServiceExists =
      await this.prisma.professionalService.findUnique({
        where: { id },
        include: {
          company: true,
          company_service: true,
          professional: true,
        },
      });

    if (!professionalServiceExists) {
      throw new NotFoundException('Serviço do profissional não encontrado');
    }
    return professionalServiceExists;
  }

  async update(
    id: string,
    {
      company_id,
      company_service_id,
      professional_id,
      description,
      duration,
      value,
    }: UpdateProfessionalServiceDto,
  ) {
    /* valida se o serviço do profissional existe*/
    await this.findOne(id);
    /* valida se a empresa existe*/
    const companyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    /* valida se o serviço da empresa existe*/
    const companyServiceExists = await this.prisma.companyService.findUnique({
      where: { id: company_service_id },
    });
    if (!companyServiceExists) {
      throw new NotFoundException('Serviço da empresa não encontrado');
    }

    /* valida se o profissional existe*/
    const professionalExists = await this.prisma.companyUser.findUnique({
      where: { id: professional_id, company_id },
    });
    if (!professionalExists) {
      throw new NotFoundException('Profissional não encontrado');
    }
    /* atualiza o serviço do profissional */
    await this.prisma.professionalService.update({
      where: { id },
      data: {
        company_id,
        company_service_id,
        description,
        duration,
        professional_id,
        value,
      },
    });
  }

  async remove(id: string) {
    /* valida se o serviço do profissional existe*/
    await this.findOne(id);

    /*remove o serviço do profissional*/
    await this.prisma.professionalService.delete({
      where: { id },
    });

    return;
  }
}
