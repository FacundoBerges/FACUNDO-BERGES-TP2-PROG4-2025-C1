import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  disableUser(@Param('id') id: string) {
    return this.usersService.changeUserStatus(id);
  }

  @Post(':id')
  enableUser(@Param('id') id: string) {
    return this.usersService.changeUserStatus(id, false);
  }
}
