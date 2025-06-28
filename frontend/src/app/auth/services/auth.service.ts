import { inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '@environments/environment';
import {
  JWToken,
  UserCredentials,
  UserRegistration,
  UserProfile,
} from '@auth/interfaces/';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private httpClient = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;
  private jwtToken = signal<string | null>(null);
  private userProfile = signal<UserProfile | null>(null);

  ngOnInit(): void {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const token = localStorage.getItem('token');

    if (token) this.jwtToken.set(token);
  }

  private saveToLocalStorage(token: string): void {
    this.jwtToken.set(token);
    localStorage.setItem('token', token);
  }

  public loadUserProfile(): Observable<UserProfile> {
    return this.httpClient
      .post<UserProfile>(`${this.baseUrl}/authorize`, {})
      .pipe(
        tap((profile: UserProfile) => {
          this.userProfile.set(profile);
        })
      );
  }

  public get currentUser(): UserProfile | null {
    return this.userProfile();
  }

  public get token(): string | null {
    return this.jwtToken();
  }

  public login(userCredentials: UserCredentials): Observable<JWToken> {
    return this.httpClient
      .post<JWToken>(`${this.baseUrl}/login`, userCredentials)
      .pipe(
        tap((response: JWToken) => {
          this.saveToLocalStorage(response.accessToken);
        }),
        tap(() => {
          this.loadUserProfile().subscribe();
        })
      );
  }

  public register(user: UserRegistration): Observable<JWToken> {
    if (!user.profilePicture) {
      const { profilePicture, ...userWithoutPicture } = user;

      return this.httpClient
        .post<JWToken>(`${this.baseUrl}/register`, userWithoutPicture)
        .pipe(
          tap((response: JWToken) => {
            this.saveToLocalStorage(response.accessToken);
          }),
          tap(() => {
            this.loadUserProfile().subscribe();
          })
        );
    }

    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.httpClient
      .post<JWToken>(`${this.baseUrl}/register`, formData)
      .pipe(
        tap((response: JWToken) => {
          this.saveToLocalStorage(response.accessToken);
        }),
        tap(() => {
          this.loadUserProfile().subscribe();
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.jwtToken.set(null);
    this.userProfile.set(null);
  }
}
