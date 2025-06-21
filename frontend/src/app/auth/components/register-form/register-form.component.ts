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

import { alphaOnlyValidator } from '../../validators/alpha-only.validator';
import { invalidPasswordValidator } from '../../validators/invalid-password.validator';
import { invalidUsernameValidator } from '../../validators/invalid-username.validator';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { FormErrorService } from '../../services/form-error.service';
import { UserRegistration } from '../../interfaces/user.interface';

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
  private formBuilder = inject(FormBuilder);
  public formErrorService = inject(FormErrorService);
  public readonly minDate = new Date('1900-01-01');
  public readonly maxDate = new Date();
  public imageFile: File | null = null;
  public hasFileSelected = computed(() => this.imageFile !== null);
  public passwordVisible = signal(false);
  public confirmPasswordVisible = signal(false);
  public registerEvent = output<UserRegistration>();
  public registerForm = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), alphaOnlyValidator]],
      surname: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(50), alphaOnlyValidator]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), invalidUsernameValidator]],
      password: ['', [Validators.required, Validators.minLength(8), invalidPasswordValidator]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), invalidPasswordValidator]],
      birthdate: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
    },
    {
      validators: [passwordMatchValidator],
    }
  );

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
    const input = fileEvent.target as HTMLInputElement;
    const image = input.files && input.files.length > 0 ? input.files[0] : null;

    this.imageFile = image;
  }

  public onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const newUser: UserRegistration = {
      name: this.name?.value.trim(),
      surname: this.surname?.value.trim(),
      email: this.email?.value.trim(),
      username: this.username?.value.trim(),
      password: this.password?.value,
      birthdate: this.birthdate?.value,
      description: this.description?.value.trim(),
      profilePicture: this.imageFile,
    };

    this.registerEvent.emit(newUser);
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

  public get birthdate(): AbstractControl | null {
    return this.registerForm.get('birthdate');
  }

  public get description(): AbstractControl | null {
    return this.registerForm.get('description');
  }

  public get profilePicture(): AbstractControl | null {
    return this.registerForm.get('profilePicture');
  }
}
