import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { Post } from '@core/interfaces/post';
import { environment } from '@environments/environment';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'sn-post-item',
  imports: [
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
  public readonly likeEvent = output<Post>();
  public post = input.required<Post>();
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
              { label: 'Eliminar', icon: 'pi pi-trash' },
            ]
          : [{ label: 'Eliminar', icon: 'pi pi-trash' }],
    },
  ]);

  public get postImageUrl(): string {
    return this.post().imageUrl ? `${this.API_URL}${this.post().imageUrl}` : '';
  }

  public get postAuthorImageUrl(): string {
    return this.post().author.profilePictureUrl
      ? `${this.API_URL}${this.post().author.profilePictureUrl}`
      : './assets/img/user-placeholder.png';
  }

  public get isPostLikedByUser(): boolean {
    return this.post().likes.some(
      (like) => like._id === this.authService.currentUser?.sub
    );
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
    this.likeEvent.emit(this.post());

    this.post().likesCount += this.isPostLikedByUser ? -1 : 1;

    if (this.isPostLikedByUser) {
      this.post().likes = this.post().likes.filter(
        (like) => like._id !== this.authService.currentUser?.sub
      );
    } else {
      this.post().likes.push({
        _id: this.authService.currentUser?.sub!,
        username: this.authService.currentUser?.username,
      });
    }
  }

  public onPostComment(): void {
    console.log('Post commented:', this.post()._id);
  }
}
