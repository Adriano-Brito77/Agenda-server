import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './../users/users.service';
import { CreateProfessionalScheduleDto } from './dto/create-professional-schedule.dto';
import { UpdateProfessionalScheduleDto } from './dto/update-professional-schedule.dto';

@Injectable()
export class ProfessionalSchedulesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create({
    name,
    email,
    cpf,
    password,
    confirmPassword,
    hire_date,
    company_id,
    day_of_week,
    start_time,
    end_time,
    break_start_time,
    break_end_time,
  }: CreateProfessionalScheduleDto) {
    /* valida se a empresa existe */
    const company = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    /* Cria o usuário para login */
    await this.usersService.create({
      name,
      email,
      cpf,
      role: 'professional',
      password,
      confirmPassword,
      company_id,
    });

    /* busca o profissional criado */
    const professional = await this.prisma.user.findFirst({
      where: { email: email, role: 'professional', company_id: company_id },
    });

    if (!professional) {
      throw new NotFoundException('Usuário não criado');
    }

    /* Cria o profissional com seus horários */
    await this.prisma.professionalSchedule.create({
      data: {
        professional_id: professional.id,
        company_id,
        hire_date,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
      },
    });
    /* cria os dias de trabalho */
    const WorkDays = await this.prisma.workDays.createMany({
      data: day_of_week.map((day) => ({
        professional_id: professional.id,
        day_of_week: day,
      })),
    });
    return;
  }

  async findAll({
    page,
    pageSize,
    search,
    orderBy,
    company_id,
  }: PaginationDto) {
    let where: any = {};

    if (company_id) {
      where.company_id = company_id;
    }

    if (!company_id) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }
    const order = orderBy
      ? {
          [orderBy.split(':')[0]]: orderBy.split(':')[1],
        }
      : { created_at: 'desc' };

    const professional = await this.paginationService.paginate(
      this.prisma.professionalSchedule,
      {
        where,
        orderBy: order,
        page,
        pageSize,
        include: {
          professional: {
            include: { work_days: true },
          },
        },
      },
    );
    return professional;
  }

  async findOne(id: string) {
    const professionalSchedule =
      await this.prisma.professionalSchedule.findUnique({
        where: { id },
        include: {
          professional: {
            include: { work_days: true },
          },
          company: true,
        },
      });
    if (!professionalSchedule) {
      throw new NotFoundException('Profissional não encontrado');
    }

    return professionalSchedule;
  }

  async update(
    id: string,
    {
      name,
      email,
      cpf,
      password,
      confirmPassword,
      hire_date,
      company_id,
      day_of_week,
      start_time,
      end_time,
      break_start_time,
      break_end_time,
    }: UpdateProfessionalScheduleDto,
  ) {
    /* valida se o usuario existe */
    const professionalSchedule = await this.findOne(id);

    /* valida se a empresa existe */
    const company = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    /* Atualiza o usuário para login */
    await this.usersService.update(professionalSchedule.professional_id, {
      name,
      email,
      cpf,
      role: 'professional',
      password,
      confirmPassword,
      company_id,
    });
    /* Atualiza o profissional com seus horários */
    await this.prisma.professionalSchedule.update({
      where: { id },
      data: {
        company_id,
        hire_date,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
      },
    });

    /* Atualiza os dias de trabalho */
    await this.prisma.workDays.deleteMany({
      where: { professional_id: professionalSchedule.professional_id },
    });

    await this.prisma.workDays.createMany({
      data: day_of_week.map((day) => ({
        professional_id: professionalSchedule.professional_id,
        day_of_week: day,
      })),
    });

    return;
  }

  async remove(id: string) {
    /* valida se o usuário existe */
    const professionalSchedule = await this.findOne(id);

    /* Deleta os dias de trabalho */
    await this.prisma.workDays.deleteMany({
      where: { professional_id: professionalSchedule.professional_id },
    });

    /* Deleta os dias de folga */
    await this.prisma.exceptionDays.deleteMany({
      where: { professional_id: professionalSchedule.professional_id },
    });

    /* Deleta os dados do profissional */
    await this.prisma.professionalSchedule.delete({
      where: { id },
    });

    /* Deleta o usuário */
    await this.prisma.user.delete({
      where: { id: professionalSchedule.professional_id },
    });

    return;
  }
}
