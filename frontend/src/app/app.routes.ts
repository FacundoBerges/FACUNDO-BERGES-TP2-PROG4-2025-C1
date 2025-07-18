import { Routes } from '@angular/router';

import { authGuard } from '@auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./core/pages/feed-page/feed-page.component').then(
            (c) => c.FeedPageComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./core/pages/profile-page/profile-page.component').then(
            (c) => c.ProfilePageComponent
          ),
      },
      {
        path: 'post',
        children: [
          {
            path: ':id',
            loadComponent: () =>
              import(
                './core/pages/post-details-page/post-details-page.component'
              ).then((c) => c.PostDetailsPageComponent),
          },
          {
            path: '**',
            redirectTo: '/home/feed',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'feed',
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/pages/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
