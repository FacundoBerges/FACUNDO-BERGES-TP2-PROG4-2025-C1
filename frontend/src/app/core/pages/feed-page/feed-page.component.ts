import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';

import { AuthService } from '@auth/services/auth.service';
import { CreatePost, Pagination, Post, Sorting } from '@core/interfaces/';
import { PostService } from '@core/services/post.service';
import { PostListComponent } from '@core/components/post/post-list/post-list.component';
import { PostFormComponent } from '@core/components/post/post-form/post-form.component';
import { PostFilterComponent } from '@core/components/post/post-filter/post-filter.component';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'sn-feed-page',
  imports: [
    AccordionModule,
    FloatLabelModule,
    SelectModule,
    PostFormComponent,
    PostListComponent,
    PostFilterComponent,
  ],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css',
})
export class FeedPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  private readonly messageService = inject(MessageService);
  private readonly pageSize = 10;
  public readonly loadingService = inject(LoadingService);
  public readonly hasMore = signal<boolean>(true);
  private page = signal<number>(0);
  public posts = signal<Post[]>([]);

  ngOnInit(): void {
    this.resetStatus();

    // TODO: remove this login logic in production
    //* This is just for testing purposes to simulate a logged-in user
    this.authService
      .login({ emailOrUsername: 'juanperez', password: 'Password123' })
      // .login({ emailOrUsername: 'pedrolopez123.-', password: 'Password321' })
      // .login({ emailOrUsername: 'adminuser', password: 'Admin123' })
      .subscribe({
        next: () => {
          this.incrementalPostLoad();
          this.messageService.add({
            severity: 'success',
            summary: 'Login exitoso',
            detail: 'Has iniciado sesión correctamente.',
          });
        },
        error: (error) => console.error('Login error:', error),
      });
  }

  private resetStatus(): void {
    this.page.set(0);
    this.hasMore.set(true);
    this.posts.set([]);
  }

  public onCreatePost(post: CreatePost): void {
    this.postService.createPost(post).subscribe({
      next: (newPost) => {
        this.posts.update((currentPosts) => [newPost, ...currentPosts]);
        this.messageService.add({
          severity: 'success',
          summary: 'Post creado',
          detail: 'El post se ha creado exitosamente.',
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating post:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error.message ||
            'No se pudo crear el post. Inténtalo más tarde.',
        });
      },
    });
  }

  public onSortingChange(sorting: Sorting): void {
    this.resetStatus();
    this.loadingService.startLoading();

    this.postService.getPosts(sorting).subscribe({
      next: (posts) => {
        if (!posts || posts.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin posts',
            detail: 'No hay posts disponibles con el criterio de ordenamiento.',
          });
          return;
        }

        this.posts.set(posts);
      },
      error: (error) => {
        console.error('Error loading sorted posts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'No se pudieron cargar los posts ordenados. Inténtalo más tarde.',
        });
      },
    });
  }

  public onLikePost(post: Post): void {
    const isLike = post.likes.some(
      (likeAuthor) => likeAuthor._id === this.authService.currentUser?.sub
    );

    this.postService.likePost(post._id, !isLike).subscribe({
      next: (updatedPost) => {
        this.posts.update((currentPosts) =>
          currentPosts.map((post) =>
            post._id === updatedPost._id
              ? { ...updatedPost, likes: [...updatedPost.likes] }
              : post
          )
        );
        const liked = updatedPost.likes.some(
          (likeAuthor) => likeAuthor._id === this.authService.currentUser?.sub
        );

        this.messageService.add({
          severity: 'success',
          summary: liked ? 'Post likeado' : 'Post deslikeado',
          detail: liked
            ? 'Has dado like al post.'
            : 'Has quitado el like al post.',
        });
      },
      error: (error) => {
        console.error('Error liking post:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo dar like al post. Inténtalo más tarde.',
        });
      },
    });
  }

  public incrementalPostLoad(sorting?: Sorting): void {
    const pagination: Pagination = {
      limit: this.pageSize,
      offset: this.page() * this.pageSize,
    };

    if (this.loadingService.isLoading() || !this.hasMore()) return;
    this.loadingService.startLoading();

    this.postService.getPosts(sorting, pagination).subscribe({
      next: (newPosts: Post[]) => {
        if (newPosts.length < this.pageSize) {
          this.hasMore.set(false);
          this.messageService.add({
            severity: 'info',
            summary: 'No hay más posts',
            detail: 'No hay más publicaciones para mostrar.',
          });
        }

        if (newPosts.length === 0) {
          this.loadingService.stopLoading();
          return;
        }

        this.posts.set([...this.posts(), ...newPosts]);
        this.page.update((page) => page + 1);
        this.loadingService.stopLoading();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading more posts:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar más posts. Inténtalo más tarde.',
        });
        this.hasMore.set(false);
        this.loadingService.stopLoading();
      },
    });
  }

  public onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 200;

    if (scrollPosition >= threshold) this.incrementalPostLoad();
  }
}
