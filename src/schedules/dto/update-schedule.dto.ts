import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateSchedulesBodySchema = z.object({
  status: z.enum(['APPROVED', 'PENDING', 'COMPLETED', 'CANCELED'], {
    message: 'Status must be one of: APPROVED, PENDING, COMPLETED, CANCELED',
  }),
});

class UpdateScheduleDto extends createZodDto(updateSchedulesBodySchema) {
  creator_id: string;
}

export { UpdateScheduleDto, updateSchedulesBodySchema };
