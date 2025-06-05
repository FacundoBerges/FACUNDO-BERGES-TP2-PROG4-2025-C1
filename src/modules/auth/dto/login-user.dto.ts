import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserLoginDataDto {
  @IsString({
    message:
      'El correo electrónico o nombre de usuario debe ser una cadena de texto.',
  })
  @MinLength(3, {
    message:
      'El correo electrónico o nombre de usuario debe tener al menos 3 caracteres.',
  })
  @MaxLength(254, {
    message:
      'El correo electrónico o nombre de usuario no puede tener más de 254 caracteres.',
  })
  @Transform(({ value }: { value: string }) =>
    value ? value.toLowerCase().trim() : value,
  )
  emailOrUsername: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(128, {
    message: 'La contraseña no puede tener más de 128 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  password: string;
}
