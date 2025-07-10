import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@auth/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly httpClient = inject(HttpClient);

  public getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  public create(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  public toggleUserStatus(
    userId: string,
    activateUser: boolean
  ): Observable<User> {
    console.log(
      `Toggling user status for userId: ${userId}, activateUser: ${activateUser}`
    );

    if (activateUser)
      return this.httpClient.post<User>(`${this.baseUrl}/${userId}`, {});

    return this.httpClient.delete<User>(`${this.baseUrl}/${userId}`);
  }
}
