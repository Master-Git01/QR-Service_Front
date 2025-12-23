import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/interfaces/user.interface';
import {
  SendOtpResponse,
  VerifyOtpResponse,
  RefreshTokenResponse,
} from '../interfaces/auth-api.interface';
import { MainPath } from '../../../core/enums/main-path.enum';
import { HttbClient } from '../../../shared/services/server/httb.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private httb = inject(HttbClient);

  // === OTP / AUTH ===

  sendPhone(phone: string): Observable<SendOtpResponse> {
    return this.httb.post(`/${MainPath.AUTH}/${MainPath.SEND_OTP}`, { phone });
  }

  resendOtp(otpId: string): Observable<{ expiresAt: number }> {
    return this.httb.post(`/${MainPath.AUTH}/${MainPath.RESEND_OTP}`, { otpId });
  }

  verifyOtp(phone: string, code: string, otpId: string): Observable<VerifyOtpResponse> {
    return this.httb.post(`/${MainPath.AUTH}/${MainPath.VERIFY_OTP}`, { phone, code, otpId });
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.get<RefreshTokenResponse>(`/${MainPath.AUTH}/${MainPath.REFRESH_TOKEN}`);
  }

  logout(token: string): Observable<{ message: string }> {
    return this.httb.post(`/${MainPath.AUTH}/${MainPath.LOGOUT}`, { token });
  }

  // === USER ===

  getMe(): Observable<User> {
    return this.http.get<User>(`/${MainPath.USERS}/${MainPath.ME}`);
  }

  /**
   * Запрос на смену номера → отправка OTP на НОВЫЙ номер ()
   */
  requestPhoneChange(newPhone: string): Observable<{ otpId: string; expiresAt: number }> {
    return this.http.post<{ otpId: string; expiresAt: number }>(
      `/${MainPath.USERS}/${MainPath.CHANGE_PHONE}`,
      {
        phone: newPhone,
      },
    );
  }

  /**
   * Подтверждение смены номера
   */
  confirmPhoneChange(otpId: string, code: string): Observable<User> {
    return this.http.post<User>(`/${MainPath.USERS}/${MainPath.CONFIRM_PHONE}`, { otpId, code });
  }

  deleteMe(): Observable<void> {
    return this.httb.delete(`/${MainPath.USERS}/${MainPath.ME}`);
  }
}
