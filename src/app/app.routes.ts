import { Routes } from '@angular/router';
import { MainPath } from './core/enums/main-path.enum';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/ui/pages/main-layout/main-layout.component';

const layoutAgnosticComponents = [
  {
    path: MainPath.MAIN,
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadComponent: () =>
      import('./libs/main/pages/main/main.component').then((c) => c.MainComponent),
  },
];

export const routes: Routes = [
  {
    path: MainPath.ROOT,
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'generate-dinamic-qr',
            loadComponent: () =>
              import('./libs/qr-generate/pages/qr-generate/qr-generate.component').then(
                (c) => c.QrGenerateComponent,
              ),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./libs/profile/page/profile/profile.component').then(
                (c) => c.ProfileComponent,
              ),
          },
          {
            path: '**',
            redirectTo: 'generate-dinamic-qr',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
  {
    path: MainPath.GUEST,
    component: MainLayoutComponent,
    children: [
      {
        path: 'free-qr-generate',
        loadComponent: () =>
          import('./libs/qr-generate/pages/qr-generate/qr-generate.component').then(
            (c) => c.QrGenerateComponent,
          ),
      },

      ...layoutAgnosticComponents,
    ],
  },
  {
    path: 'onboard',
    loadComponent: () =>
      import('./libs/auth/pages/auth/auth.component').then((c) => c.AuthComponent),
  },
];
