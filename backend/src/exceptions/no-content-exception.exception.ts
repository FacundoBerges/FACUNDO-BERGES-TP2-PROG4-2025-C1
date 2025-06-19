import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor(message: string = 'No content available') {
    super(message, HttpStatus.NO_CONTENT);
  }
}
