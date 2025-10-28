import { Routes } from '@angular/router';
import { MainPath } from './core/enums/main-path.enum';
import { authGuard } from './core/guards/auth.guard';
import { AuthorizedLayoutComponent } from './layout/ui/pages/authorized-layout/authorized-layout.component';
import { UnauthorizedLayoutComponent } from './layout/ui/pages/unauthorized-layout/unauthorized-layout.component';

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
    component: AuthorizedLayoutComponent,
    canActivate: [authGuard],
    // children: [...все остальные компоненты],
  },
  {
    path: MainPath.GUEST,
    component: UnauthorizedLayoutComponent,
    children: [
      // {
      //   path: MainPath.FREE_GENERATE,
      //   component: loadComponent: () => import('./libs/free-qr-generate/pages/free-qr-generate.component').then((c) => c.FreeQrGenerateComponent),
      // },
      ...layoutAgnosticComponents,
    ],
  },
  // {
  //   path: 'login',
  //   loadComponent: () => import('').then((c) => c.LoginContainerComponent),
  // },
  // {
  //   path: 'signup',
  //   loadComponent: () => import('').then((c) => c.RegisterContainerComponent),
  // },
];
