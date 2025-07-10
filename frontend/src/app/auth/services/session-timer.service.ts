import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionTimerService {
  private sessionWarning$ = new Subject<void>();
  private sessionExpired$ = new Subject<void>();
  private warningSubscription?: Subscription;
  private expiredSubscription?: Subscription;

  public startSessionTimer(): void {
    this.warningSubscription = timer(10 * 60 * 1000).subscribe(() => {
      this.sessionWarning$.next();

      this.expiredSubscription = timer(5 * 60 * 1000).subscribe(() => {
        this.sessionExpired$.next();
        this.clear();
      });
    });
  }

  public resetSessionTimer(): void {
    this.clear();
    this.startSessionTimer();
  }

  public clear(): void {
    if (this.warningSubscription) {
      this.warningSubscription.unsubscribe();
      this.warningSubscription = undefined;
    }

    if (this.expiredSubscription) {
      this.expiredSubscription.unsubscribe();
      this.expiredSubscription = undefined;
    }
  }

  public get sessionWarning(): Observable<void> {
    return this.sessionWarning$.asObservable();
  }

  public get sessionExpired(): Observable<void> {
    return this.sessionExpired$.asObservable();
  }
}
