import { Component, input } from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

import { Comment } from '@core/interfaces/comment';
import { CommentItemComponent } from './comment-item/comment-item.component';

@Component({
  selector: 'sn-post-comments',
  imports: [AnimateOnScrollModule, CommentItemComponent],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent {
  public comments = input.required<Comment[]>();
}
