import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'sn-register-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    FileUploadModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private FormBuilder = inject(FormBuilder);
  public registerForm = this.FormBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    surname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        // TODO: Add custom password validation
      ],
    ],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    birthdate: [
      '',
      [Validators.required, Validators.pattern(/^\d{2}-\d{2}-\d{4}$/)],
    ],
    description: ['', [Validators.maxLength(500)]],
    profilePicture: [''],
  });
  public passwordVisible = signal(false);
  public confirmPasswordVisible = signal(false);

  public togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }

  public toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible.update((visible) => !visible);
  }

  public onUpload(uploadEvent: UploadEvent) {
    console.log('Handle register submit.', this.registerForm.value);
  }

  public onSubmit() {
    console.log('Handle register submit.', this.registerForm.value);
  }
}
