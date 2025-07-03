import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { DividerModule } from 'primeng/divider';

import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { Post, Pagination, Sorting } from '@core/interfaces';
import { PostService } from '@core/services/post.service';
import { UserImageComponent } from '@core/components/profile/user-image/user-image.component';
import { UserInfoComponent } from '@core/components/profile/user-info/user-info.component';
import { PostListComponent } from '@core/components/post/post-list/post-list.component';

@Component({
  selector: 'sn-profile-page',
  imports: [
    AnimateOnScrollModule,
    DividerModule,
    UserImageComponent,
    UserInfoComponent,
    PostListComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private timeoutId?: ReturnType<typeof setTimeout>;
  private router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  public user = signal<User>({} as User);
  public posts = signal<Post[]>([]);

  ngOnInit(): void {
    this.authService.loadUserProfile().subscribe({
      next: (user: User) => {
        this.user.set(user);
        this.loadLatestPosts();
      },
      error: async (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error.message ||
            'Error al obtener los datos del usuario. Redirigiendo a la página de inicio.',
        });

        this.timeoutId = setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  public onLike(post: Post): void {
    const isLike = post.likes.some(
      (likeAuthor) => likeAuthor._id === this.authService.currentUser?.sub
    );

    this.postService.likePost(post._id, isLike).subscribe({
      next: (updatedPost: Post) => {
        const updatedPosts = this.posts().map((p) =>
          p._id === updatedPost._id ? updatedPost : p
        );
        this.posts.set(updatedPosts);

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: isLike
            ? 'Has quitado tu like de la publicación.'
            : 'Has dado like a la publicación.',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error.message ||
            'Error al dar like a la publicación. Inténtalo de nuevo más tarde.',
        });
      },
    });
  }

  private loadLatestPosts() {
    const defaultSorting: Sorting = { sortBy: 'createdAt', sortOrder: 'desc' };
    const latestThreePosts: Pagination = { limit: 3, offset: 0 };
    const authorId = this.user().sub;

    this.postService
      .getPosts(defaultSorting, latestThreePosts, authorId)
      .subscribe({
        next: (posts: Post[]) => {
          this.posts.set(posts);
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error.message ||
              'Error al cargar las publicaciones. Inténtalo de nuevo más tarde.',
          });
        },
      });
  }
}
