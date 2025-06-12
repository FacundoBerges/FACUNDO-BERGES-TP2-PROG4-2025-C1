import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreatePostDto {
  @MinLength(2, { message: 'El título debe tener al menos 2 carácter.' })
  @MaxLength(100, {
    message: 'El título no puede tener más de 100 caracteres.',
  })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  readonly title: string;

  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
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

  @Type(() => mongoose.Types.ObjectId)
  @IsString({ message: 'El ID del autor debe ser una cadena de texto.' })
  @Transform(({ value }: { value: string }) =>
    value ? new mongoose.Types.ObjectId(value) : value,
  )
  readonly authorId: mongoose.Types.ObjectId;
}
