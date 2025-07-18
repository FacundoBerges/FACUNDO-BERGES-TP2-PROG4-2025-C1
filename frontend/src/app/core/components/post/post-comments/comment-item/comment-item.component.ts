import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';

import { ConfirmationService, MenuItem } from 'primeng/api';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { Comment } from '@core/interfaces/comment';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'sn-comment-item',
  imports: [DatePipe, AnimateOnScrollModule, ButtonModule, MenuModule],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css',
})
export class CommentItemComponent {
  public readonly authService = inject(AuthService);
  public readonly confirmationService = inject(ConfirmationService);
  public readonly onCommentEditEvent = output<Comment>();
  public readonly onCommentDeleteEvent = output<Comment>();
  public comment = input.required<Comment>();
  public showOptions = computed(() => {
    if (!this.authService.currentUser) return false;
    return (
      this.authService.currentUser.sub === this.comment().author._id ||
      this.authService.currentUser.profile === 'admin'
    );
  });
  public options = computed<MenuItem[]>(() => [
    {
      label: 'Opciones',
      items:
        this.authService.currentUser?.sub === this.comment().author._id
          ? [
              {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => this.onCommentEditEvent.emit(this.comment()),
              },
              {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.confirmDeleteComment(),
              },
            ]
          : [
              {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.confirmDeleteComment(),
              },
            ],
    },
  ]);

  private confirmDeleteComment(): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      message: '¿Estás seguro de que quieres eliminar este comentario?',
      accept: () => {
        this.deleteComment();
      },
    });
  }

  private deleteComment(): void {
    this.onCommentDeleteEvent.emit(this.comment());
  }
}
