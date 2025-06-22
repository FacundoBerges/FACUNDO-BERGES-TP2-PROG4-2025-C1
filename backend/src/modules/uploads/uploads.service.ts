import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  buildPublicFilePath(file: Express.Multer.File): string | undefined {
    if (!file || !file.destination || !file.filename) return undefined;

    const destinationPathSegments = file.destination.split('public');
    const destinationPath =
      destinationPathSegments.length > 1
        ? destinationPathSegments[1]
        : file.destination;
    const filePath = path.join(destinationPath, file.filename);

    return filePath.replace(/\\/g, '/');
  }
}
