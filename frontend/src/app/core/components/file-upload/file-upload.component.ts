import { Component, inject, output, signal } from '@angular/core';

import { MessageModule } from 'primeng/message';

import { FileService } from '@core/services/file.service';

@Component({
  selector: 'sn-file-upload',
  imports: [MessageModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  private readonly fileService = inject(FileService);
  public readonly fileChangeEvent = output<File | null>();
  public hasFileSelected = signal<boolean>(false);
  public hasError = signal<boolean>(false);

  public onFileSelected(fileEvent: Event): void {
    const optionalFile = this.fileService.setImageFile(fileEvent);

    this.hasFileSelected.set(!!optionalFile);
    this.hasError.set(!optionalFile || !optionalFile.type.startsWith('image/'));

    this.fileChangeEvent.emit(optionalFile);
  }
}
