import {
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const uploadImagePipe: ParseFilePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 2,
    message: 'El tamaño máximo del archivo es de 2MB',
  })
  .build({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
    fileIsRequired: false,
  });
