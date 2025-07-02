import { Component, input, output } from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

import { Comment } from '@core/interfaces/comment';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { CommentFormComponent } from './create-comment/comment-form.component';

@Component({
  selector: 'sn-post-comments',
  imports: [AnimateOnScrollModule, CommentItemComponent, CommentFormComponent],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent {
  public comments = input.required<Comment[]>();
  public commentSubmitEvent = output<string>();

  public onCommentSubmit(comment: string): void {
    if (!comment) return;

    this.commentSubmitEvent.emit(comment);
  }
}
