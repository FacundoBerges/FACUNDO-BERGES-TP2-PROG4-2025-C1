import { Injectable, OnDestroy, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements OnDestroy {
  private setTimeoutId: ReturnType<typeof setTimeout> | null = null;
  public readonly isLoading = signal(false);

  ngOnDestroy(): void {
    if (this.setTimeoutId) {
      clearTimeout(this.setTimeoutId);
      this.setTimeoutId = null;
    }
  }

  public startLoading(): void {
    this.isLoading.set(true);
  }

  public stopLoading(): void {
    this.setTimeoutId = setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }
}
