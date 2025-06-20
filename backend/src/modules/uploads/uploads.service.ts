import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class UploadsService {
  buildPublicFilePath(file: Express.Multer.File): string | undefined {
    if (file && file.destination && file.filename) {
      const destinationPathSegments = file.destination.split('public');
      const destinationPath =
        destinationPathSegments.length > 1
          ? destinationPathSegments[1]
          : file.destination;
      const filename = `${Date.now.toString()}-${file.filename}`;
      const filePath = path.join(destinationPath, filename);
      return filePath.replace(/\\/g, '/');
    }

    return undefined;
  }
}
