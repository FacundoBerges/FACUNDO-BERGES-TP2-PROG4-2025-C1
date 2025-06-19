import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor(message: string = 'No content available') {
    super(
      {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'No Content',
        cause: message,
      },
      HttpStatus.NO_CONTENT,
    );
  }
}
