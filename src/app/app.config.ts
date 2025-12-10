import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appendApiUrlInterceptor } from './core/interceptors/append-api-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([appendApiUrlInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
