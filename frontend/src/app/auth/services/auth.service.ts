import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserCredentials, UserRegistration, JWToken } from '../interfaces/';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private httpClient = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;
  private token: string | null = null;

  ngOnInit(): void {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    this.token = localStorage.getItem('token');
  }

  public saveToLocalStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public login(userCredentials: UserCredentials): Observable<JWToken> {
    return this.httpClient.post<JWToken>(
      `${this.baseUrl}/login`,
      userCredentials
    );
  }

  public register(user: UserRegistration): Observable<JWToken> {
    if (!user.profilePicture) {
      const { profilePicture, ...userWithoutPicture } = user;

      return this.httpClient.post<JWToken>(
        `${this.baseUrl}/register`,
        userWithoutPicture
      );
    }

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.httpClient.post<JWToken>(`${this.baseUrl}/register`, formData);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.token = null;
  }

  public isAuthenticated(): boolean {
    console.log('Checking authentication status...');

    // TODO: Implement authentication logic here
    // !For now, just return true to simulate an authenticated user
    return true;
  }
}
