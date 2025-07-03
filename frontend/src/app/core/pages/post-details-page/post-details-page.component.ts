import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Comment, Post } from '@core/interfaces/';
import { CommentService } from '@core/services/comment.service';
import { PostService } from '@core/services/post.service';
import { PostItemComponent } from '@core/components/post/post-list/post-item/post-item.component';
import { PostCommentsComponent } from '@core/components/post/post-comments/post-comments.component';

@Component({
  selector: 'sn-post-details-page',
  imports: [PostItemComponent, PostCommentsComponent],
  templateUrl: './post-details-page.component.html',
  styleUrl: './post-details-page.component.css',
})
export class PostDetailsPageComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly commentService = inject(CommentService);
  private readonly postService = inject(PostService);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  public post = signal<Post | null>(null);
  public commentToAdd = signal<Comment | null>(null);
  public commentToUpdate = signal<Comment | null>(null);

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!postId) {
      console.error('Post ID not found in route parameters');
      return;
    }

    this.postService.getPostById(postId).subscribe({
      next: (post: Post) => {
        this.post.set(post);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching post:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el post.',
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
      this.timeoutId = null;
    }
  }

  public onCommentSubmit(comment: string): void {
    if (!comment) return;

    const post = this.post();

    if (!post) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo encontrar el post.',
      });
      return;
    }

    this.commentService.addComment(post._id, comment).subscribe({
      next: (createdComment: Comment) => {
        this.commentToAdd.set(createdComment);
        this.messageService.add({
          severity: 'success',
          summary: 'Comentario agregado',
          detail: 'Tu comentario ha sido enviado exitosamente.',
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating comment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el comentario.',
        });
      },
    });
  }

  public onCommentEdited(editedComment: Comment): void {
    this.commentService
      .updateComment(editedComment._id, { content: editedComment.content })
      .subscribe({
        next: (updatedComment) => {
          this.commentToUpdate.set(updatedComment);
          this.messageService.add({
            severity: 'success',
            summary: 'Comentario editado',
            detail: 'El comentario fue actualizado correctamente.',
          });
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el comentario.',
          });
        },
      });
  }
}
