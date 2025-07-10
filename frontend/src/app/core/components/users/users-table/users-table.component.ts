import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { environment } from '@environments/environment';
import { User } from '@auth/interfaces';

@Component({
  selector: 'sn-users-table',
  imports: [
    DatePipe,
    FormsModule,
    AvatarModule,
    TableModule,
    ToggleButtonModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css',
})
export class UsersTableComponent {
  public readonly updatedUserStatus = output<User>();
  public readonly apiUrl = environment.apiUrl;
  public users = input.required<User[]>();

  public getUserAvatarUrl(user: User): string {
    return user.profilePictureUrl
      ? `${this.apiUrl}${user.profilePictureUrl}`
      : '/assets/img/user-placeholder.png';
  }

  public onToggleUserStatus(user: User): void {
    this.updatedUserStatus.emit(user);
  }
}
