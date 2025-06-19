import { Type, Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
  IsIn,
  IsBoolean,
  IsDate,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';

import { Profile } from '../interfaces/profile.type';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
  readonly name: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(50, {
    message: 'El apellido no puede tener más de 50 caracteres.',
  })
  readonly surname: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MinLength(5, {
    message: 'El correo electrónico debe tener al menos 5 caracteres.',
  })
  @MaxLength(254, {
    message: 'El correo electrónico no puede tener más de 254 caracteres.',
  })
  @Transform(({ value }: { value: string }) =>
    value ? value.toLowerCase().trim() : value,
  )
  readonly email: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres.',
  })
  @MaxLength(30, {
    message: 'El nombre de usuario no puede tener más de 30 caracteres.',
  })
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números, guiones bajos, puntos o guiones medios.',
  })
  @Transform(({ value }: { value: string }) =>
    value ? value.toLowerCase().trim() : value,
  )
  readonly username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(128, {
    message: 'La contraseña no puede tener más de 128 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  readonly password: string;

  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'El perfil ingresado no es válido.' })
  readonly profile?: Profile;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano.' })
  readonly isActive?: boolean;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida.' })
  @MinDate(new Date('1900-01-01'), {
    message: 'La fecha de nacimiento debe ser posterior al 1 de enero de 1900.',
  })
  @MaxDate(new Date(Date.now()), {
    message: 'La fecha de nacimiento no puede ser posterior a la fecha actual.',
  })
  readonly birthday: Date;

  @IsOptional()
  @IsString({
    message: 'La URL de foto de perfil debe ser una cadena de texto.',
  })
  @MaxLength(1024, {
    message:
      'La URL de la foto de perfil no puede tener más de 1024 caracteres.',
  })
  userProfilePictureUrl?: string;

  @IsOptional()
  @IsString({ message: 'La biografía debe ser una cadena de texto.' })
  @MaxLength(500, {
    message: 'La biografía no puede tener más de 500 caracteres.',
  })
  readonly bio: string;
}
