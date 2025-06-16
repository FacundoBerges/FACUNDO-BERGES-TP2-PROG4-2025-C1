import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString({
    message: 'El contenido del comentario debe ser una cadena de texto.',
  })
  @Length(1, 500, {
    message: 'El contenido del comentario debe tener entre 1 y 500 caracteres.',
  })
  @Transform(({ value }: { value: string }) => (value ? value.trim() : value))
  content: string;
}
