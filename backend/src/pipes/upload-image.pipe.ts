import {
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';

export const uploadImagePipe: ParseFilePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 5,
    message: 'El tamaño máximo permitido de archivos es de 10MB',
  })
  .build({
    errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE,
    fileIsRequired: false,
  });
