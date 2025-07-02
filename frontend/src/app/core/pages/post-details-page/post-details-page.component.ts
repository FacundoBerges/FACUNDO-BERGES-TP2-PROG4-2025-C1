import { Component, inject, OnInit, signal } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { Comment, CommentDto } from '@core/interfaces/comment';
import { Post } from '@core/interfaces/post';
import { PostService } from '@core/services/post.service';
import { PostItemComponent } from '@core/components/post/post-list/post-item/post-item.component';
import { PostCommentsComponent } from '@core/components/post/post-comments/post-comments.component';

@Component({
  selector: 'sn-post-details-page',
  imports: [PostItemComponent, PostCommentsComponent],
  templateUrl: './post-details-page.component.html',
  styleUrl: './post-details-page.component.css',
})
export class PostDetailsPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly postService = inject(PostService);
  public post = signal<Post | null>(null);
  public comments = signal<Comment[]>([]);

  ngOnInit(): void {
    // const postId = this.postService.getPostIdFromRoute();

    // if (postId) {
    //   this.postService.loadPostDetails(postId);
    // } else {
    //   console.error('No post ID found in route');
    // }

    const fetchedComments: Comment[] = [
      {
        _id: '6854368fb4037ca91ff569af',
        content: 'Comentario de prueba',
        createdAt: new Date('2025-06-28T20:37:25.520Z'),
        updatedAt: new Date('2025-06-28T20:37:25.520Z'),
        author: {
          _id: '6854368fb4037ca91ff569af',
          name: 'Admin',
          surname: 'Sistema',
          username: 'adminuser',
          profilePictureUrl: null,
        },
      },
      {
        _id: '6854368fb4037ca91ff569af',
        content: 'Otro comentario de prueba',
        createdAt: new Date('2025-06-25T20:37:25.520Z'),
        updatedAt: new Date('2025-06-29T20:37:25.520Z'),
        author: {
          _id: '6854368fb4037ca91ff569af',
          name: 'Usuario',
          surname: 'Prueba',
          username: 'user123',
          profilePictureUrl: null,
        },
      },
    ];

    const fetchedPost: Post = {
      _id: '6860528592d405a5c4f26f4e',
      title: 'Post de administrador',
      description: 'Publicación de prueba para subir una imagen!',
      imageUrl:
        '/uploads/img/posts/1751143040088-4k-space-pictures-zp773pnlw9zp3jq7.jpg',
      commentsCount: 0,
      author: {
        _id: '6854368fb4037ca91ff569af',
        name: 'Admin',
        surname: 'Sistema',
        username: 'adminuser',
        profilePictureUrl: null,
      },
      createdAt: '2025-06-28T20:37:25.520Z',
      updatedAt: '2025-06-28T20:37:25.520Z',
      likesCount: 0,
      likes: [],
    };
    this.post.set(fetchedPost);
    this.comments.set([...fetchedComments]);
    console.log('fetchedComments', this.comments());
  }

  public onCommentSubmit(comment: string): void {
    if (!comment) return;

    const newComment: CommentDto = {
      content: comment,
    };

    console.log('New comment submitted:', newComment);
  }
}
