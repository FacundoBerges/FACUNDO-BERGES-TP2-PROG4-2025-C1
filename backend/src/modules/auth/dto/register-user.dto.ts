import { OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class RegisterUserDto extends OmitType(CreateUserDto, [
  'profile',
  'isActive',
] as const) {}
