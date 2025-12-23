import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/utils/local-storage.service';
import { StorageKey } from '../../shared/enums/storage-key.enum';
import { Auth } from '../../libs/auth/interfaces/auth.interface';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authGuard = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  const status = localStorageService.get<Auth>(StorageKey.AUTH_STATE)?.status;

  if (status === 'authenticated') {
    return true;
  } else {
    router.navigate(['/guest/main']);
    return false;
  }
};
