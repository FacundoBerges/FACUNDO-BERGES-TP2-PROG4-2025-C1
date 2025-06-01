import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { passwordMatchValidator } from '../../validators/password-match-validator';
import { FormErrorService } from '../../services/form-error.service';

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
    MessageModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private FormBuilder = inject(FormBuilder);
  public FormErrorService = inject(FormErrorService);
  public registerForm = this.FormBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      birthdate: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)],
      ],
      description: ['', [Validators.maxLength(500)]],
      profilePicture: [''],
    },
    {
      validators: [passwordMatchValidator],
    }
  );
  public passwordVisible = signal(false);
  public confirmPasswordVisible = signal(false);

  public get name(): AbstractControl | null {
    return this.registerForm.get('name');
  }

  public get surname(): AbstractControl | null {
    return this.registerForm.get('surname');
  }

  public get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  public get username(): AbstractControl | null {
    return this.registerForm.get('username');
  }

  public get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  public get birthdate(): AbstractControl | null {
    return this.registerForm.get('birthdate');
  }

  public get description(): AbstractControl | null {
    return this.registerForm.get('description');
  }

  public get profilePicture(): AbstractControl | null {
    return this.registerForm.get('profilePicture');
  }

  public getErrorMessage(controlName: string): string | void {
    return this.FormErrorService.getErrorMessage(
      controlName,
      this.registerForm
    );
  }

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
