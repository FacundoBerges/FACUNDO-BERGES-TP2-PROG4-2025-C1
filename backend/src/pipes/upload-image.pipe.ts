import {
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const uploadImagePipe: ParseFilePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 10,
    message: 'El tamaño máximo permitido de archivos es de 10MB',
  })
  .build({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
    fileIsRequired: false,
  });
