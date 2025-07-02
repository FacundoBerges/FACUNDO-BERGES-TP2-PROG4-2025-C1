import { Component, input } from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'sn-user-image',
  imports: [AnimateOnScrollModule],
  templateUrl: './user-image.component.html',
  styleUrl: './user-image.component.css',
})
export class UserImageComponent {
  public imageUrl = input<string>();
}
