import { Component, computed, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { FormErrorService } from '@auth/services/form-error.service';
import { CreatePost } from '@core/interfaces/post';
import { FileUploadComponent } from '@core/components/file-upload/file-upload.component';

@Component({
  selector: 'sn-post-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupModule,
    InputGroupAddonModule,
    MessageModule,
    TextareaModule,
    FileUploadComponent,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly formErrorService = inject(FormErrorService);
  public imageFile = signal<File | null>(null);
  public readonly submitEvent = output<CreatePost>();
  public createForm = this.formBuilder.group({
    title: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)],
    ],
  });
  public hasFileSelected = computed(() => this.imageFile() !== null);

  public getErrorMessage(controlName: string): string | void {
    return this.formErrorService.getErrorMessage(controlName, this.createForm);
  }

  public onFileSelected(imageFile: File | null): void {
    this.imageFile.set(imageFile);
  }

  public onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const newPost: CreatePost = {
      title: this.title?.value?.trim(),
      description: this.description?.value?.trim(),
      image: this.imageFile(),
    };

    this.submitEvent.emit(newPost);
    this.createForm.reset();
  }

  //* getters for form controls

  public get title(): AbstractControl | null {
    return this.createForm.get('title');
  }

  public get description(): AbstractControl | null {
    return this.createForm.get('description');
  }
}
