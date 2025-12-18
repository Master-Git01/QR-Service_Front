import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL', {
  factory: (): string => 'http://localhost:3000',
});
