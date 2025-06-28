import { Component, inject, OnInit, signal } from '@angular/core';

import { MessageService } from 'primeng/api';

import { Post } from '../../interfaces/post';
import { AuthService } from '../../../auth/services/auth.service';
import { PostService } from '../../services/post.service';
import { PostListComponent } from '../../components/post/post-list/post-list.component';

@Component({
  selector: 'sn-feed-page',
  imports: [PostListComponent],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css',
})
export class FeedPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  private readonly messageService = inject(MessageService);
  public posts = signal<Post[]>([]);

  ngOnInit(): void {
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
