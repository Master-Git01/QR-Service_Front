import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/utils/local-storage.service';
import { StorageKey } from '../../shared/enums/storage-key.enum';
import { OtpState } from '../../libs/auth/services/auth.service';

// import { LocalStorageService, StorageKey } from '@shared/util-storage';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authGuard = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  const isAuthenticated = localStorageService.get<OtpState>(StorageKey.OTP_STATE);

  if (isAuthenticated?.state === 'authenticated') {
    return true;
  } else {
    router.navigate(['/guest/main']);
    return false;
  }

  // const token = localStorageService.get<string>(StorageKey.JWT_TOKEN);
};
