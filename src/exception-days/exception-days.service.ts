import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PrismaService } from '../prisma.service';
import { PaginationService } from './../pagination/pagination.service';
import { CreateExceptionDayDto } from './dto/create-exception-day.dto';
import { UpdateExceptionDayDto } from './dto/update-exception-day.dto';

@Injectable()
export class ExceptionDaysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create({
    professional_id,
    company_id,
    date,
    start_time,
    end_time,
  }: CreateExceptionDayDto) {
    /* valida se o usuario existe*/
    if (professional_id) {
      const userAlreadyExists = await this.prisma.user.findUnique({
        where: { id: professional_id, company_id, role: 'professional' },
      });
      if (!userAlreadyExists) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }
    /* valida se a empresa existe */
    const companyAlreadyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyAlreadyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    await this.prisma.exceptionDays.create({
      data: {
        professional_id,
        company_id,
        date,
        start_time,
        end_time,
      },
    });

    return;
  }

  async findAll({
    page,
    pageSize,
    search,
    orderBy,
    professional_id,
    company_id,
  }: PaginationDto) {
    let where: any = {};

    if (company_id) {
      where = {
        ...where,
        professional_id: null,
        company_id,
      };
    }
    if (!company_id) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (professional_id) {
      where = { professional_id, company_id };
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { company: { name: { contains: search, mode: 'insensitive' } } },
        { professional: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const order = orderBy
      ? { [orderBy.split(':')[0]]: orderBy.split(':')[1] }
      : { created_at: 'desc' };

    const exceptionDays = await this.paginationService.paginate(
      this.prisma.exceptionDays,
      {
        where,
        page,
        pageSize,
        orderBy: order,
        include: {
          company: true,
        },
      },
    );

    return exceptionDays;
  }

  async findOne(id: string) {
    const exceptionDay = await this.prisma.exceptionDays.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
    if (!exceptionDay) {
      throw new NotFoundException('Nenhum feriado ou folga encontrado');
    }
    return exceptionDay;
  }

  async update(
    id: string,
    {
      professional_id,
      company_id,
      date,
      start_time,
      end_time,
    }: UpdateExceptionDayDto,
  ) {
    await this.findOne(id);

    /* valida se o usuario existe*/
    if (professional_id) {
      const userAlreadyExists = await this.prisma.user.findUnique({
        where: { id: professional_id, company_id, role: 'professional' },
      });
      if (!userAlreadyExists) {
        throw new NotFoundException('Usuário não encontrado');
      }
    }
    /* valida se a empresa existe */
    const companyAlreadyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyAlreadyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }

    await this.prisma.exceptionDays.update({
      where: { id },
      data: {
        professional_id,
        company_id,
        date,
        start_time,
        end_time,
      },
    });

    return;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.exceptionDays.delete({
      where: { id },
    });
    return;
  }
}
