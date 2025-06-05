import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./core/pages/feed-page/feed-page.component').then(c => c.FeedPageComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./core/pages/profile-page/profile-page.component').then(c => c.ProfilePageComponent)
      },
      {
        path: '**',
        redirectTo: 'feed'
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/pages/login-page/login-page.component').then(c => c.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/pages/register-page/register-page.component').then(c => c.RegisterPageComponent)
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
