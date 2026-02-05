import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';

import { createUserBodySchema, CreateUserDto } from './dto/create-user.dto';
import { updateUserBodySchema, UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(
    @Body(new ZodValidationPipe(createUserBodySchema))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }
 
  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.usersService.findAll();
  }
  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateUserBodySchema)) updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
