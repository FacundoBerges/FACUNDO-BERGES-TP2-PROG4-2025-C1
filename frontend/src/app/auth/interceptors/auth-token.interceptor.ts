import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const token: string | null = authService.token;

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });

    return next(clonedReq);
  }

  return next(req);
};
