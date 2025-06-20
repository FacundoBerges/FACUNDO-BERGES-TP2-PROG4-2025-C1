import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsBoolean({ message: 'El campo isDeleted debe ser un booleano.' })
  readonly isDeleted?: boolean;
}
