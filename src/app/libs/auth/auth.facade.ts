import { inject, Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthState } from './state/auth.state';
import { OtpState } from './interfaces/otp.interface';
import { Observable } from 'rxjs';
import { AuthStatus } from './interfaces/auth.interface';
import { Router } from '@angular/router';
import { MainPath } from '../../core/enums/main-path.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly authService: AuthService = inject(AuthService);
  private readonly authState: AuthState = inject(AuthState);
  private readonly router: Router = inject(Router);

  readonly otp$: Observable<OtpState | null> = this.authState.otp$;
  readonly authStatus$: Observable<AuthStatus | null> = this.authState.authStatus$;

  readonly accessToken = this.authState.accessToken;

  refreshToken(): Observable<string> {
    return this.authService.refreshToken();
  }

  sendPhone(phone: string): void {
    const masked = this.maskPhone(phone);

    this.authState.send(phone, masked);

    this.authService.sendPhone(phone).subscribe();
  }

  verifyOtp(code: string): void {
    this.authState.verify();

    this.authService.verifyOtp(code).subscribe();

    this.router.navigate([`/${MainPath.AUTH}/${MainPath.GENERATE_DINAMIC_QR}`]);
  }

  resendOtp(): void {
    this.authService.resendOtp().subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe();

    this.router.navigate([`/${MainPath.ONBOARD}`]);
  }

  deleteMe(): void {
    this.authService.deleteMe().subscribe();

    this.router.navigate([`/${MainPath.GUEST}/${MainPath.MAIN}`]);
  }

  setOtp(): void {
    this.authState.setOtp();
  }

  resetOtp(): void {
    this.authState.setOtp();
  }

  resetAuthState(): void {
    this.authState.reset();
    this.router.navigate([`${MainPath.ROOT}`]);
  }

  private maskPhone(phone: string | null): string | null {
    if (!phone) return null;

    return phone.replace(/(\+?\d{1,3}|8)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 XXX-XX-$5');
  }
}
