import { Component, input, output } from '@angular/core';

import { Post } from '../../../interfaces/post';
import { PostItemComponent } from '../post-item/post-item.component';

@Component({
  selector: 'sn-post-list',
  imports: [PostItemComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  public posts = input.required<Post[]>();
  public readonly postLikeEvent = output<Post>();

  public onLikePost(post: Post): void {
    this.postLikeEvent.emit(post);
  }
}
