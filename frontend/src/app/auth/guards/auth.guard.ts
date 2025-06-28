import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';

export const authGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const token = authService.token;

  if (!token) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { redirectTo: state.url },
    });
  }

  return authService.loadUserProfile().pipe(
    map(() => true),
    catchError(() =>
      of(
        router.createUrlTree(['/auth/login'], {
          queryParams: { redirectTo: state.url },
        })
      )
    )
  );
};
