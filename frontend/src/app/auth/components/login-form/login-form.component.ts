import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { FormErrorService } from '../../services/form-error.service';
import { invalidPasswordValidator } from '../../validators/invalid-password.validator';

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
  public invalidForm = computed(() => {
    return (
      this.loginForm.invalid && (this.loginForm.dirty || this.loginForm.touched)
    );
  });

  public togglePasswordVisibility() {
    this.passwordVisible.update((visible) => !visible);
  }

  public onSubmit() {
    // TODO: Implement login logic
    console.log('Handle submit.');
  }

  // * Getters for form controls
  public get emailOrUsername() {
    return this.loginForm.get('emailOrUsername');
  }

  public get password() {
    return this.loginForm.get('password');
  }

  public getErrorMessage(controlName: string): string | void {
    return this.formErrorService.getErrorMessage(controlName, this.loginForm);
  }
}
