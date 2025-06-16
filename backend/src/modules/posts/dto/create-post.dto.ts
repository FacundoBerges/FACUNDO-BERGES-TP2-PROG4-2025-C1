import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @MaxLength(100, {
    message: 'El título no puede tener más de 100 caracteres.',
  })
  @MinLength(2, { message: 'El título debe tener al menos 2 carácter.' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  readonly title: string;

  @MinLength(1, {
    message: 'La descripción debe tener al menos 1 caracteres.',
  })
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres.',
  })
  readonly content: string;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto.' })
  contentImageUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo isDeleted debe ser un booleano.' })
  readonly isDeleted?: boolean;
}
