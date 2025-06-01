import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'sn-login-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private formBuilder = inject(FormBuilder);
  public loginForm = this.formBuilder.group({
    emailOrUsername: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        // TODO: Add custom password validation
      ],
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
}
