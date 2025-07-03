import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);

  if (authService.currentUser?.profile.toLowerCase() !== 'admin') {
    const router = inject(Router);

    router.navigate(['/']);
    return false;
  }

  return true;
};
