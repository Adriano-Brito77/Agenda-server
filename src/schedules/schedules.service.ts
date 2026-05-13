import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    {
      date,
      start_time,
      is_paid,
      notification,
      status,
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
    /* verifica se o cliente tem conta*/
    const clientAlreadyExists = client_id
      ? await this.prisma.user.findUnique({ where: { id: client_id } })
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
      ? await this.prisma.companyUser.findFirst({
          where: { professional_id: professional_id, company_id: company_id },
        })
      : null;

    if (!professionalAlreadyExists) {
      throw new NotFoundException('Profissional não encontrado');
    }

    let professionalServicesText = professional_service_id.toString();

    // const schedules = await this.prisma.schedules.create({
    //   data: {
    //     starts_at: ,
    //     ends_at:  ,
    //     duration_in_minutes: 1,
    //     is_paid,
    //     notification,
    //     status,
    //     notes,
    //     client_email_external,
    //     client_name_external,
    //     number,
    //     creator_id: user_id,
    //     client_id,
    //     professional_id,
    //     professional_service_id: professionalServicesText,
    //     company_id,
    //   },
    // });

    /* verifica se o serviço vinculado ao profissional existe */
    for (const id of professional_service_id) {
      const professionalServiceAlreadyExists =
        await this.prisma.professionalService.findFirst({
          where: {
            id: id,
            professional_id: professional_id ? professional_id : user_id,
            company_id: company_id,
          },
        });

      if (!professionalServiceAlreadyExists) {
        throw new NotFoundException('Serviço do profissional não encontrado');
      }
      /* cria o vinculo do agendamentos com os serviços*/
      // await this.prisma.scheduleServices.create({
      //   data: {
      //     name: professionalServiceAlreadyExists.description,
      //     duration: professionalServiceAlreadyExists.duration,
      //     value: professionalServiceAlreadyExists.value,
      //     schedule_id: schedules.id,
      //     service_id: professionalServiceAlreadyExists.id,
      //   },
      // });
    }
  }

  findAll() {
    return `This action returns all schedules`;
  }

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
