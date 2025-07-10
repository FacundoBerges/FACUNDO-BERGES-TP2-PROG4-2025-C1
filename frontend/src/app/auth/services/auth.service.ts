import { inject, Injectable, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '@environments/environment';
import {
  JWToken,
  UserCredentials,
  UserRegistration,
  User,
} from '@auth/interfaces/';
import { SessionTimerService } from './session-timer.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionTimerService = inject(SessionTimerService);
  private baseUrl = `${environment.apiUrl}/auth`;
  private jwtToken = signal<string | null>(null);
  private userProfile = signal<User | null>(null);

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

  public loadUserProfile(): Observable<User> {
    this.loadFromLocalStorage();

    return this.httpClient.post<User>(`${this.baseUrl}/authorize`, {}).pipe(
      tap((profile: User) => {
        this.userProfile.set(profile);
      })
    );
  }

  public get currentUser(): User | null {
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
        }),
        tap(() => {
          this.sessionTimerService.startSessionTimer();
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
          }),
          tap(() => {
            this.sessionTimerService.startSessionTimer();
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

  public refreshToken(): Observable<JWToken> {
    return this.httpClient.post<JWToken>(`${this.baseUrl}/refresh`, {}).pipe(
      tap((response: JWToken) => {
        this.saveToLocalStorage(response.accessToken);
      }),
      tap(() => {
        this.loadUserProfile().subscribe();
      }),
      tap(() => {
        this.sessionTimerService.resetSessionTimer();
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.jwtToken.set(null);
    this.userProfile.set(null);
    this.sessionTimerService.clear();
    this.router.navigate(['/auth', 'login']);
  }
}
