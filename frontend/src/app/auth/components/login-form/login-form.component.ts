import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { UserCredentials } from '@auth/interfaces/';
import { FormErrorService } from '@auth/services/form-error.service';
import { invalidPasswordValidator } from '@auth/validators/';

@Component({
  selector: 'sn-login-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    MessageModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private formBuilder = inject(FormBuilder);
  private formErrorService = inject(FormErrorService);
  public loginForm = this.formBuilder.group({
    emailOrUsername: ['', [Validators.required, Validators.minLength(3)]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), invalidPasswordValidator],
    ],
  });
  public passwordVisible = signal(false);
  public loginEvent = output<UserCredentials>();

  public togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const userCredentials: UserCredentials = {
      emailOrUsername: this.emailOrUsername?.value.trim(),
      password: this.password?.value,
    };

    this.loginEvent.emit(userCredentials);
    this.loginForm.reset();
  }

  // * Getters for form controls
  public get emailOrUsername(): AbstractControl | null {
    return this.loginForm.get('emailOrUsername');
  }

  public get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  public getErrorMessage(controlName: string): string | void {
    return this.formErrorService.getErrorMessage(controlName, this.loginForm);
  }
}
