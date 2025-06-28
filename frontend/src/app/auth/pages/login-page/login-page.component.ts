import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../services/auth.service';
import { FooterLinkText, UserCredentials } from '../../interfaces/';
import { FormBodyComponent } from '../../components/shared/form/form-body/form-body.component';
import { FormComponent } from '../../components/shared/form/form.component';
import { FormFooterComponent } from '../../components/shared/form/form-footer/form-footer.component';
import { FormHeaderComponent } from '../../components/shared/form/form-header/form-header.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'sn-login-page',
  imports: [
    ButtonModule,
    FormComponent,
    FormHeaderComponent,
    FormBodyComponent,
    FormFooterComponent,
    LoginFormComponent,
    RouterModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnDestroy {
  private $currentLogin: Subscription | null = null;
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private timeoutRef?: ReturnType<typeof setTimeout>;
  public footerLink = signal<FooterLinkText>({
    text: 'Regístrate',
    url: '/auth/register',
  }).asReadonly();

  ngOnDestroy(): void {
    if (this.$currentLogin) {
      this.$currentLogin.unsubscribe();
      this.$currentLogin = null;
    }

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = undefined;
    }
  }

  public onLogin(credentials: UserCredentials): void {
    this.$currentLogin = this.authService.login(credentials).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Inicio de sesión exitoso',
          detail: 'Bienvenido de nuevo!',
        });
        this.timeoutRef = setTimeout(() => {
          this.router.navigate(['/home/feed']);
        }, 1000);
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de inicio de sesión',
          detail:
            error.error?.message ||
            'Error desconocido al iniciar sesión, por favor intente nuevamente.',
        });
      },
    });
  }
}
