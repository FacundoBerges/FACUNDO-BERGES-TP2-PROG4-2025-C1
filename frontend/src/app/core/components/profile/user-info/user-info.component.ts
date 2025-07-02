import { DatePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

import { User } from '@auth/interfaces/user.interface';

@Component({
  selector: 'sn-user-info',
  imports: [DatePipe, LowerCasePipe, TitleCasePipe, AnimateOnScrollModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  public user = input.required<User>();

  public get fullName(): string {
    return `${this.user()?.name} ${this.user()?.surname}`;
  }
}
