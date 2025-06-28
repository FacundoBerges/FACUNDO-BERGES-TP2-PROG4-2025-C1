import { Component, computed, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { UserRegistration } from '@auth/interfaces/';
import { FormErrorService } from '@auth/services/form-error.service';
import {
  alphaOnlyValidator,
  invalidPasswordValidator,
  invalidUsernameValidator,
  passwordMatchValidator,
} from '@auth/validators/';
import { FileService } from '@core/services/file.service';

@Component({
  selector: 'sn-register-form',
  imports: [
    ButtonModule,
    DatePickerModule,
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
  private readonly formBuilder = inject(FormBuilder);
  public readonly formErrorService = inject(FormErrorService);
  public readonly fileService = inject(FileService);
  public readonly minDate = new Date('1900-01-01');
  public readonly maxDate = new Date();
  public imageFile: File | null = null;
  public hasFileSelected = computed(() => this.imageFile !== null);
  public passwordVisible = signal(false);
  public confirmPasswordVisible = signal(false);
  public registerEvent = output<UserRegistration>();
  public registerForm = this.formBuilder.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          alphaOnlyValidator,
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          alphaOnlyValidator,
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(254),
          Validators.email,
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          invalidUsernameValidator,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          invalidPasswordValidator,
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          invalidPasswordValidator,
        ],
      ],
      birthday: ['', [Validators.required]],
      bio: ['', [Validators.maxLength(500)]],
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  private getIsoDate(date: string): Date {
    const dateParts = date.trim().split('/');

    if (!dateParts || dateParts.length !== 3)
      throw new Error('Invalid date format. Expected DD/MM/YYYY.');

    const day = parseInt(dateParts[0], 10),
      monthIndex = parseInt(dateParts[1], 10) - 1,
      year = parseInt(dateParts[2], 10);

    return new Date(year, monthIndex, day);
  }

  public getErrorMessage(controlName: string): string | void {
    return this.formErrorService.getErrorMessage(
      controlName,
      this.registerForm
    );
  }

  public togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  public toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update((visible) => !visible);
  }

  public onFileSelected(fileEvent: Event): void {
    this.imageFile = this.fileService.setImageFile(fileEvent);
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const ISODate = this.getIsoDate(this.birthday?.value?.trim());
    const newUser: UserRegistration = {
      name: this.name?.value?.trim(),
      surname: this.surname?.value?.trim(),
      email: this.email?.value?.trim(),
      username: this.username?.value?.trim(),
      password: this.password?.value,
      birthday: ISODate,
      bio: this.bio?.value?.trim(),
      profilePicture: this.imageFile,
    };

    this.registerEvent.emit(newUser);
    this.registerForm.reset();
  }

  // * Getters for form controls

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

  public get birthday(): AbstractControl | null {
    return this.registerForm.get('birthday');
  }

  public get bio(): AbstractControl | null {
    return this.registerForm.get('bio');
  }

  public get profilePicture(): AbstractControl | null {
    return this.registerForm.get('profilePicture');
  }
}
