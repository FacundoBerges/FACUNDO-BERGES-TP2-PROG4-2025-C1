import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AuthService } from '@auth/services/auth.service';
import { SessionTimerService } from '@auth/services/session-timer.service';
import { LoadingService } from '@shared/services/loading.service';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

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
  private readonly confirmationService = inject(ConfirmationService);
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

    this.sessionTimerService.sessionWarning.subscribe(() => {
      console.log('Session warning triggered');

      this.confirmationService.confirm({
        rejectIcon: 'pi pi-times',
        acceptIcon: 'pi pi-check',
        dismissableMask: true,
        position: 'top',
        header: 'Aviso de sesión',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Extender',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-success',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.authService.refreshToken().subscribe();
        },
        message: 'Tu sesión está por expirar. ¿Deseas extenderla?',
      });
    });

    this.sessionTimerService.sessionExpired.subscribe(() => {
      console.log('Session expired, logging out');

      this.confirmationService.close();
      this.authService.logout();
      this.loadingService.stopLoading();
    });
  }
}
