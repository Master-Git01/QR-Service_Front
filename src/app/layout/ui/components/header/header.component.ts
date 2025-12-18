import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, OtpState } from '../../../../libs/auth/services/auth.service';
import { LocalStorageService } from '../../../../shared/utils/local-storage.service';
import { StorageKey } from '../../../../shared/enums/storage-key.enum';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);

  public otpState$ = this.authService.otpState$;

  ngOnInit(): void {
    const otpState = this.localStorageService.get<OtpState>(StorageKey.OTP_STATE);
    console.log('Restored OTP state from localStorage:', otpState);
    if (otpState) {
      this.authService.updateOtpState(otpState);
    }
  }
}
