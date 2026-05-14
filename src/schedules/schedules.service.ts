import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {}

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
