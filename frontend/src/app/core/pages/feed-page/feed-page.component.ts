import { Component, inject, OnInit, signal } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';

import { AuthService } from '@auth/services/auth.service';
import { CreatePost, Post } from '@core/interfaces/post';
import { PostService } from '@core/services/post.service';
import { PostListComponent } from '@core/components/post/post-list/post-list.component';
import { PostFormComponent } from '@core/components/post/post-form/post-form.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'sn-feed-page',
  imports: [PostListComponent, AccordionModule, PostFormComponent],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css',
})
export class FeedPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  private readonly messageService = inject(MessageService);
  public posts = signal<Post[]>([]);

  ngOnInit(): void {
    // TODO: remove this login logic in production
    //* This is just for testing purposes to simulate a logged-in user
    this.authService
      // .login({ emailOrUsername: 'juanperez', password: 'Password123' })
      .login({ emailOrUsername: 'pedrolopez123.-', password: 'Password321' })
      .subscribe({
        next: () => {
          this.postService.getPosts().subscribe({
            next: (posts) => {
              if (!posts || posts.length === 0) {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Sin posts',
                  detail: 'No hay posts disponibles en este momento.',
                });
                return;
              }

              this.posts.set(posts);
            },
            error: (error) => {
              console.error('Error loading posts:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los posts. Inténtalo más tarde.',
              });
            },
          });
        },
        error: (error) => console.error('Login error:', error),
      });
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

  public onLikePost(post: Post): void {
    const isLike = !this.posts().some(
      (p) =>
        p._id === post._id &&
        p.likes.map((p) => p._id).includes(this.authService.currentUser?.sub!)
    );

    console.log('Is like:', isLike);

    this.postService.likePost(post._id, isLike).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: isLike ? 'Post likeado' : 'Post deslikeado',
          detail: isLike
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
}
