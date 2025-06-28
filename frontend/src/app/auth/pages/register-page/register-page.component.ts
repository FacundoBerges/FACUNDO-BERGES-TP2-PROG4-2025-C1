import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { AuthService } from '@auth/services/auth.service';
import { FooterLinkText, UserRegistration } from '@auth/interfaces/';
import { FormBodyComponent } from '@auth/components/shared/form/form-body/form-body.component';
import { FormComponent } from '@auth/components/shared/form/form.component';
import { FormFooterComponent } from '@auth/components/shared/form/form-footer/form-footer.component';
import { FormHeaderComponent } from '@auth/components/shared/form/form-header/form-header.component';
import { RegisterFormComponent } from '@auth/components/register-form/register-form.component';

@Component({
  selector: 'sn-register-page',
  imports: [
    FormBodyComponent,
    FormComponent,
    FormFooterComponent,
    FormHeaderComponent,
    RegisterFormComponent,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnDestroy {
  private $currentRegister: Subscription | null = null;
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  public footerLink = signal<FooterLinkText>({
    text: 'Ingresa',
    url: '/auth/login',
  });

  ngOnDestroy(): void {
    if (this.$currentRegister) {
      this.$currentRegister.unsubscribe();
      this.$currentRegister = null;
    }
  }

  public onRegister(userRegistration: UserRegistration): void {
    this.$currentRegister = this.authService
      .register(userRegistration)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Tu cuenta ha sido creada correctamente.',
          });
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de registro',
            detail:
              error.error?.message ||
              'Ocurrió un error al registrar tu cuenta. Por favor, intenta nuevamente más tarde.',
          });
        },
      });
  }
}
