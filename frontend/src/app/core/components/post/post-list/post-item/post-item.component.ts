import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ConfirmationService, MenuItem } from 'primeng/api';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { environment } from '@environments/environment';
import { AuthService } from '@auth/services/auth.service';
import { Post } from '@core/interfaces/post';

@Component({
  selector: 'sn-post-item',
  imports: [
    RouterLink,
    DatePipe,
    AnimateOnScrollModule,
    ButtonModule,
    ConfirmDialogModule,
    MenuModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css',
})
export class PostItemComponent {
  private readonly API_URL = environment.apiUrl;
  public readonly authService = inject(AuthService);
  public readonly confirmationService = inject(ConfirmationService);
  public readonly likeEvent = output<Post>();
  public readonly onPostDeleteEvent = output<Post>();
  public post = input.required<Post>();
  public showIconOnly = input.required<boolean>();
  public showOptions = computed(() => {
    if (!this.authService.currentUser) return false;
    return (
      this.authService.currentUser.sub === this.post().author._id ||
      this.authService.currentUser.profile === 'admin'
    );
  });
  public options = computed<MenuItem[]>(() => [
    {
      label: 'Opciones',
      items:
        this.authService.currentUser?.sub === this.post().author._id
          ? [
              { label: 'Editar', icon: 'pi pi-pencil' },
              {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.confirmDeletePost(),
              },
            ]
          : [
              {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.confirmDeletePost(),
              },
            ],
    },
  ]);
  public postLikedByUser = computed(() =>
    this.post().likes.some(
      (likeAuthor) => likeAuthor._id === this.authService.currentUser?.sub
    )
  );

  public get postImageUrl(): string {
    return this.post()?.imageUrl
      ? `${this.API_URL}${this.post().imageUrl}`
      : '';
  }

  public get postAuthorImageUrl(): string {
    return this.post()?.author.profilePictureUrl
      ? `${this.API_URL}${this.post().author.profilePictureUrl}`
      : './assets/img/user-placeholder.png';
  }

  public get likesMessage(): string {
    const likesCount = this.post().likesCount;

    if (likesCount < 0)
      throw new Error('La cantidad de likes no puede ser negativa');

    switch (likesCount) {
      case 0:
        return 'Aún no hay likes';
      case 1:
        return '1 persona le gusta este post';
      default:
        return `${likesCount} personas le gustan este post`;
    }
  }

  public get commentsMessage(): string {
    const commentsCount = this.post().commentsCount;

    if (commentsCount < 0)
      throw new Error('La cantidad de comentarios no puede ser negativa');

    switch (commentsCount) {
      case 0:
        return 'Aún no hay comentarios';
      case 1:
        return '1 persona ha comentado este post';
      default:
        return `${commentsCount} personas han comentado este post`;
    }
  }

  public onPostLike(): void {
    if (!this.authService.currentUser) {
      console.warn('User not authenticated');
      return;
    }

    this.likeEvent.emit(this.post());
  }

  private confirmDeletePost(): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      message: '¿Estás seguro de que quieres eliminar esta publicación?',
      accept: () => {
        this.deletePost();
      },
    });
  }

  private deletePost(): void {
    this.onPostDeleteEvent.emit(this.post());
  }
}
