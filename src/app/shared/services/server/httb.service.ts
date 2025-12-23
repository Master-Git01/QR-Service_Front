import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

// ====== DTO ======

export interface SendOtpResponse {
  otpId: string;
  expiresAt: number;
  message: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: User;
}

export interface User {
  id: string;
  phone: string;
}

// ====== INTERNAL TYPES ======

interface OtpSession {
  id: string;
  phone: string;
  code: number;
  expiresAt: number;
  attempts: number;
}

// ====== FAKE SERVER ======

@Injectable({ providedIn: 'root' })
export class HttbClient {
  private users = new Map<string, User>();
  private otps = new Map<string, OtpSession>();
  private tokens = new Map<string, string>(); // accessToken -> userId

  // ====== POST overloads ======

  post(url: '/auth/send-otp', body: { phone: string }): Observable<SendOtpResponse>;
  post(url: '/auth/resend-otp', body: { otpId: string }): Observable<{ expiresAt: number }>;
  post(url: '/auth/cancel-otp', body: { otpId: string }): Observable<void>;
  post(
    url: '/auth/verify-otp',
    body: { phone: string; code: string; otpId: string },
  ): Observable<VerifyOtpResponse>;
  post(url: '/auth/refresh', body: { token: string }): Observable<RefreshTokenResponse>;
  post(url: '/auth/validate', body: { token: string }): Observable<ValidateTokenResponse>;
  post(url: '/auth/logout', body: { token: string }): Observable<{ message: string }>;

  post(
    url: '/users/change-phone',
    body: { phone: string },
  ): Observable<{ otpId: string; expiresAt: number }>;

  post(url: '/users/confirm-phone', body: { otpId: string; code: string }): Observable<User>;

  // ====== POST implementation ======

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(url: string, body: any): Observable<any> {
    switch (url) {
      case '/auth/send-otp': {
        const otp = this.createOtp(body.phone);

        // 👇 ВАЖНО: показываем код
        alert(`OTP для ${body.phone}: ${otp.code}`);

        return of({
          otpId: otp.id,
          expiresAt: otp.expiresAt,
          message: 'OTP sent',
        });
      }

      case '/auth/resend-otp': {
        const otp = this.otps.get(body.otpId);

        alert(`OTP для ${body.phone}: ${otp!.code}`);

        if (!otp) return throwError(() => new Error('OTP not found'));
        otp.expiresAt = Date.now() + 5 * 60_000;
        return of({ expiresAt: otp.expiresAt });
      }

      case '/auth/cancel-otp': {
        this.otps.delete(body.otpId);
        return of(void 0);
      }

      case '/auth/verify-otp': {
        const otp = this.otps.get(body.otpId);
        if (!otp) return throwError(() => new Error('OTP not found'));

        if (otp.code !== body.code) {
          otp.attempts++;
          return throwError(() => new Error('Invalid code'));
        }

        let user = [...this.users.values()].find((u) => u.phone === body.phone);
        if (!user) {
          user = { id: crypto.randomUUID(), phone: body.phone };
          this.users.set(user.id, user);
        }

        const accessToken = 'access-' + crypto.randomUUID();
        const refreshToken = 'refresh-' + crypto.randomUUID();
        this.tokens.set(accessToken, user.id);

        this.otps.delete(body.otpId);

        return of({ accessToken, refreshToken, user });
      }

      case '/auth/refresh': {
        return of({ accessToken: 'access-' + crypto.randomUUID() });
      }

      case '/auth/validate': {
        const userId = this.tokens.get(body.token);
        if (!userId) {
          return of({ valid: false });
        }

        const user = this.users.get(userId);

        return of({
          valid: true,
          user,
        });
      }

      case '/auth/logout': {
        this.tokens.delete(body.token);
        return of({ message: 'Logged out' });
      }

      case '/users/change-phone': {
        const otp = this.createOtp(body.phone);
        return of({ otpId: otp.id, expiresAt: otp.expiresAt });
      }

      case '/users/confirm-phone': {
        const otp = this.otps.get(body.otpId);
        if (!otp || otp.code !== body.code) {
          return throwError(() => new Error('Invalid OTP'));
        }

        const user = [...this.users.values()][0];
        user.phone = otp.phone;

        this.otps.delete(body.otpId);
        return of(user);
      }

      default:
        return throwError(() => new Error('Unknown POST ' + url));
    }
  }

  // ====== GET ======

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(url: '/users/me'): Observable<User> {
    const user = [...this.users.values()][0];
    return user ? of(user) : throwError(() => new Error('Not authenticated'));
  }

  // ====== DELETE ======

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(url: '/users/me'): Observable<void> {
    this.users.clear();
    this.tokens.clear();
    return of(void 0);
  }

  // ====== HELPERS ======

  private createOtp(phone: string): OtpSession {
    const otp: OtpSession = {
      id: crypto.randomUUID(),
      phone,
      code: Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000,
      expiresAt: Date.now() + 5 * 60_000,
      attempts: 0,
    };
    this.otps.set(otp.id, otp);
    return otp;
  }
}
// cancelOtp(otpId: string): Observable<void> {
//   return this.http.post<void>('/auth/cancel-otp', { otpId });
// }
