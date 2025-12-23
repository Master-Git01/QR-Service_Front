import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { onboardComponent } from '../../components/onboard/onboard.component';
import { OtpFormComponent } from '../../components/otp-form/otp-form.component';
import { AuthFacade } from '../../auth.facade';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, AsyncPipe, onboardComponent, OtpFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  public otpState$ = this.authFacade.otp$;

  onSubmit(code: string): void {
    this.authFacade.verifyOtp(code);
  }

  onResendOtp(): void {
    this.authFacade.resendOtp();
  }

  onChangePhone(): void {
    this.authFacade.resetOtp();
  }

  goHome(): void {
    this.authFacade.resetAuthState();
  }
}
