import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { userSelect } from '../users/users.service';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
  ) {}

  async create(
    {
      date,
      start_time,
      notes,
      client_email_external,
      client_name_external,
      number,
      client_id,
      professional_id,
      professional_service_id,
      company_id,
    }: CreateScheduleDto,
    user_id: string,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      /* verifica se o profissional é o cliente */
      if (client_id && !professional_id && client_id === user_id) {
        throw new BadRequestException(
          'O profissional não pode marcar um horário para ele mesmo como cliente',
        );
      }

      /* verifica se o cliente tem conta*/
      const clientAlreadyExists = client_id
        ? await prisma.user.findUnique({ where: { id: client_id } })
        : null;

      if (
        !clientAlreadyExists &&
        !client_email_external &&
        !client_name_external &&
        !number
      ) {
        throw new BadRequestException(
          'Caso nenhum cliente seja encontrado, o email, o nome e o número são obrigatórios',
        );
      }

      /* verifica se o profissional existe */
      const professionalAlreadyExists = professional_id
        ? await prisma.companyUser.findFirst({
            where: { professional_id: professional_id, company_id: company_id },
          })
        : null;

      if (!professionalAlreadyExists) {
        throw new NotFoundException('Profissional não encontrado');
      }

      /* verifica se o serviço vinculado ao profissional existe */

      let durationInMinutes = 0;
      let valueTotalServices = 0;

      const professionalServiceAlreadyExists =
        await prisma.professionalService.findMany({
          where: {
            id: { in: professional_service_id },
            professional_id: professional_id ? professional_id : user_id,
            company_id: company_id,
          },
        });

      const professionalServiceIds = professionalServiceAlreadyExists.map(
        (service) => service.id,
      );
      const missingServiceIds = professional_service_id.filter(
        (id) => !professionalServiceIds.includes(id),
      );

      if (missingServiceIds.length > 0) {
        throw new NotFoundException(
          `Serviços com IDs ${missingServiceIds.join(', ')} não encontrados para o profissional`,
        );
      }

      /* calcula a duração total dos serviços */
      durationInMinutes = professionalServiceAlreadyExists.reduce(
        (total, service) => total + service.duration,
        0,
      );
      /* calcula o valor total do serviço */
      valueTotalServices = professionalServiceAlreadyExists.reduce(
        (total, service) => total + service.value,
        0,
      );

      /*Formata o horário de início e fim*/
      let startTime = new Date(date);
      startTime.setHours(parseInt(start_time.split(':')[0]));
      startTime.setMinutes(parseInt(start_time.split(':')[1]));

      let endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + Math.floor(durationInMinutes / 60));
      endTime.setMinutes(endTime.getMinutes() + (durationInMinutes % 60));

      let endTimewithHours = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

      const breakProfessional = await prisma.professionalSchedule.findFirst({
        where: {
          professional_id: professional_id ? professional_id : user_id,
          company_id: company_id,
        },
      });

      if (
        breakProfessional
          ? start_time === breakProfessional.break_start_time &&
            endTimewithHours === breakProfessional.break_end_time
          : false
      ) {
        throw new BadRequestException(
          'Nao é permitido agendar no horário de intervalo do profissional.',
        );
      }

      if (
        breakProfessional
          ? start_time <= breakProfessional.break_start_time &&
            endTimewithHours >= breakProfessional.break_end_time
          : false
      ) {
        throw new BadRequestException(
          'O horário de início ou término do agendamento conflita com o horário de intervalo do profissional.',
        );
      }

      if (
        breakProfessional
          ? endTimewithHours > breakProfessional.break_start_time &&
            breakProfessional.break_end_time < endTimewithHours
          : false
      ) {
        throw new BadRequestException(
          'O horário de final do agendamento conflita com o horário de intervalo do profissional.',
        );
      }

      if (
        breakProfessional
          ? start_time > breakProfessional.break_start_time &&
            breakProfessional.break_end_time < start_time
          : false
      ) {
        throw new BadRequestException(
          'O horário de início do agendamento conflita com o horário de intervalo do profissional.',
        );
      }

      /* valida se há conflito de horários */
      const conflictingSchedule = await prisma.schedules.findFirst({
        where: {
          professional_id: professional_id ? professional_id : user_id,
          company_id: company_id,
          starts_at: { lt: endTime },
          ends_at: { gt: startTime },
        },
      });

      if (conflictingSchedule) {
        const existingStart = conflictingSchedule.starts_at;
        const existingEnd = conflictingSchedule.ends_at;

        let message = 'Horario do profissional conflita com outro agendamento.';

        if (
          existingStart.getTime() === startTime.getTime() &&
          existingEnd.getTime() === endTime.getTime()
        ) {
          message = 'Já existe um agendamento exatamente nesse horário.';
        }

        if (startTime <= existingStart && endTime >= existingEnd) {
          message =
            'O intervalo informado engloba um agendamento já existente.';
        }

        if (existingStart <= startTime && existingEnd > startTime) {
          message =
            'O horário inicial informado conflita com outro agendamento.';
        }

        if (existingStart < endTime && existingEnd >= endTime) {
          message = 'O horário final conflita com outro agendamento.';
        }

        throw new BadRequestException(message);
      }

      /* criar um agendamento no banco de dados */
      const schedules = await prisma.schedules.create({
        data: {
          starts_at: startTime,
          ends_at: endTime,
          duration_in_minutes: durationInMinutes,
          value_total_services: valueTotalServices,
          notes,
          client_email_external,
          client_name_external,
          number,
          creator_id: user_id,
          client_id,
          professional_id: professional_id ? professional_id : user_id,
          company_id,
        },
      });

      /* cria o vinculo do agendamentos com os serviços*/
      await prisma.scheduleServices.createMany({
        data: professionalServiceAlreadyExists.map((service) => ({
          name: service.description,
          duration: service.duration,
          value: service.value,
          schedule_id: schedules.id,
          service_id: service.id,
        })),
      });
    });
  }

  async findAll({
    page,
    pageSize,
    orderBy,
    search,
    company_id,
    professional_id,
  }: PaginationDto) {
    let where = {};
    if (search) {
      where = {
        OR: [
          { client_name_external: { contains: search, mode: 'insensitive' } },
          { client_email_external: { contains: search, mode: 'insensitive' } },
          { number: { contains: search, mode: 'insensitive' } },
          { company_id: { contains: search, mode: 'insensitive' } },
          { professional: { name: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    if (company_id) {
      where = { ...where, company_id };
    }
    if (professional_id) {
      where = { ...where, professional_id };
    }

    const order = orderBy
      ? {
          [orderBy.split(':')[0]]: orderBy.split(':')[1],
        }
      : { created_at: 'desc' };

    const schedules = await this.pagination.paginate(this.prisma.schedules, {
      where,
      page,
      pageSize,
      orderBy: order,
      include: {
        professional: {
          select: userSelect,
        },
        schedules_services: {
          include: true,
        },
      },
    });

    return schedules;
  }

  findOne(id: string) {
    return `This action returns a #${id} schedule`;
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: string) {
    return `This action removes a #${id} schedule`;
  }
}
