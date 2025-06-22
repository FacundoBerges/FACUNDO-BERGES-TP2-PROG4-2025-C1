import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

  public register(user: UserRegistration): Observable<any> {
    if (!user.profilePicture) {
      console.warn('No profile picture provided, registering without it.');
      console.info('Registering user with data:', user);
      // return this.httpClient.post(`${this.baseUrl}/register`, user);
      return of();
    }
    const formData = new FormData();

    formData.append('profile-picture', user.profilePicture);
    Object.entries(user).forEach(([key, value]) => {
      if (value && value !== 'profile-picture') formData.append(key, value);
    });

    console.info('Registering user with data:', formData);

    return of();
    // return this.httpClient.post(`${this.baseUrl}/register`, formData);
  }

  public logout(): void {
    console.log('Logging out...');

    // TODO: Implement your logout logic here
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
