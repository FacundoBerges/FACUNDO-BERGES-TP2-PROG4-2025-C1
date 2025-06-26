import { Component } from '@angular/core';

import { PostListComponent } from '../../components/post/post-list/post-list.component';

@Component({
  selector: 'sn-feed-page',
  imports: [PostListComponent],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.css',
})
export class FeedPageComponent {}
