import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  public setImageFile(fileEvent: Event): File | null {
    const input = fileEvent.target as HTMLInputElement;

    return input.files && input.files.length > 0 ? input.files[0] : null;
  }
}
