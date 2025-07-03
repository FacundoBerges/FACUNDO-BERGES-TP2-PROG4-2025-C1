import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';

import { AuthService } from '@auth/services/auth.service';
import { SessionTimerService } from '@auth/services/session-timer.service';
import { LoadingService } from '@shared/services/loading.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SessionWarningDialogComponent } from '@shared/components/session-warning-dialog/session-warning-dialog.component';

@Component({
  selector: 'sn-root',
  imports: [
    RouterOutlet,
    ToastModule,
    ConfirmDialogModule,
    HeaderComponent,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly authService = inject(AuthService);
  private readonly sessionTimerService = inject(SessionTimerService);
  private readonly router = inject(Router);
  public readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loadingService.startLoading();

    this.authService.loadUserProfile().subscribe({
      next: () => {
        this.loadingService.stopLoading();
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading user profile:', error);
        this.loadingService.stopLoading();
        this.authService.logout();
        this.router.navigate(['/auth', 'login']);
      },
    });

    this.sessionTimerService.startSessionTimer();

    this.sessionTimerService.sessionWarning.subscribe(() => {
      const ref = this.dialogService.open(SessionWarningDialogComponent, {
        header: 'Sesión a punto de expirar',
        width: '25rem',
        modal: true,
        closable: false,
        data: {
          message: 'Tu sesión está a punto de expirar. ¿Deseas continuar?',
        },
      });

      ref.onClose.subscribe((result: boolean) => {
        if (result) {
          this.authService.refreshToken().subscribe({
            next: () => {
              this.sessionTimerService.resetSessionTimer();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error refreshing token:', error);
              this.authService.logout();
            },
          });
        }
      });

      this.sessionTimerService.sessionExpired.subscribe(() => {
        this.authService.logout();
        this.loadingService.stopLoading();
      });
    });
  }
}
