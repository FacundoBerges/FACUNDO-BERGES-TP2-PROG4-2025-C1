import { Component, inject, OnInit, signal } from '@angular/core';

import { MessageService } from 'primeng/api';

import { User } from '@auth/interfaces';
import { UserService } from '@core/services/user.service';
import { UsersTableComponent } from '@core/components/users/users-table/users-table.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'sn-users-page',
  imports: [UsersTableComponent, LoadingComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);
  public readonly loadingService = inject(LoadingService);
  public users = signal<User[]>([]);

  ngOnInit(): void {
    this.loadingService.isLoading.set(true);

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set([...users]);
        this.loadingService.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loadingService.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios. Inténtalo más tarde.',
        });
      },
    });
  }

  public onUpdatedUserStatus(user: User): void {
    this.userService.toggleUserStatus(user._id!, user.isActive!).subscribe({
      next: (updatedUser) => {
        this.updateUserInList(updatedUser);

        this.messageService.add({
          severity: 'info',
          summary: 'Usuario actualizado',
          detail: `El usuario ${user.name} ha sido actualizado correctamente.`,
        });
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo actualizar el estado del usuario ${user.name}. Inténtalo más tarde.`,
        });
      },
    });
  }

  private updateUserInList(user: User): void {
    this.users.update((currentUsers) =>
      currentUsers.map((u) => (u._id === user._id ? user : u))
    );
  }
}
