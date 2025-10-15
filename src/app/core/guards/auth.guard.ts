import { inject } from '@angular/core';
import { Router } from '@angular/router';

// import { LocalStorageService, StorageKey } from '@shared/util-storage';

export const authGuard = () => {
  const router = inject(Router);
  // const localStorageService = inject(LocalStorageService);

  // const token = localStorageService.get<string>(StorageKey.JWT_TOKEN);

  // eslint-disable-next-line no-constant-condition
  if (true) {
    router.navigate(['/guest/main']);
    return false;
  }

  return true;
};

