import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService, OtpState } from '../../services/auth.service';
import { LocalStorageService } from '../../../../shared/utils/local-storage.service';
import { StorageKey } from '../../../../shared/enums/storage-key.enum';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/registr/registr.component';
import { OtpFormComponent } from '../../components/otp-form/otp-form.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, AsyncPipe, LoginComponent, RegisterComponent, OtpFormComponent, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly route = inject(ActivatedRoute);

  public otpState$ = this.authService.otpState$;
  public mode: 'login' | 'signup' = 'login';

  ngOnInit(): void {
    const otpState = this.localStorageService.get<OtpState>(StorageKey.OTP_STATE);
    if (otpState) {
      this.authService.updateOtpState(otpState);
    }

    this.route.queryParamMap.subscribe((map) => {
      const mode = map.get('mode');
      if (mode === 'signup' || mode === 'login') {
        this.mode = mode;
      }
    });
  }

  goHome(): void {
    this.authService.resetOtpState();
  }
}
