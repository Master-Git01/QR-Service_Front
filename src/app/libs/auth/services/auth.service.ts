import { DestroyRef, inject, Injectable } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { BehaviorSubject, catchError, filter, map, Observable, take, tap, throwError } from 'rxjs';
import {
  RefreshTokenResponse,
  SendOtpResponse,
  VerifyOtpResponse,
} from '../interfaces/auth-api.interface';
import { AuthState } from '../state/auth.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApiService: AuthApiService = inject(AuthApiService);
  private readonly authState: AuthState = inject(AuthState);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  private isRefreshing = false;

  sendPhone(phone: string): Observable<SendOtpResponse> {
    return this.authApiService.sendPhone(phone).pipe(
      tap((response: SendOtpResponse) =>
        this.authState.sendSuccess(response.otpId, response.expiresAt, response.message),
      ),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  verifyOtp(code: string): Observable<VerifyOtpResponse> {
    const phone = this.authState.otp?.phone;
    const otpId = this.authState.otp?.otpId;

    return this.authApiService.verifyOtp(phone!, code, otpId!).pipe(
      tap((response: VerifyOtpResponse) => {
        return this.authState.verifySuccess(response.user, response.accessToken);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  resendOtp(): Observable<{ expiresAt: number }> {
    const otpId = this.authState.otp?.otpId;

    return this.authApiService.resendOtp(otpId!).pipe(
      tap((response: { expiresAt: number }) => {
        return this.authState.sendSuccess(otpId!, response.expiresAt);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  refreshToken(): Observable<string> {
    // Явно указываем, что возвращаем строку
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => token !== null), // Type guard
        take(1),
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null); // Очищаем старый флаг

    return this.authApiService.refreshToken().pipe(
      tap((response: RefreshTokenResponse) => {
        // Вызываем методы состояния
        this.authState.refreshSuccess(response.accessToken, response.user);
        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.accessToken);
      }),
      map((response) => response.accessToken), // Превращаем Response в строку
      catchError((err) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        return throwError(() => err);
      }),
      // takeUntilDestroyed здесь не нужен, так как мы используем take(1) или завершаем запрос
    );
  }

  logout(): Observable<{ message: string }> {
    const accessToken = this.authState.accessToken;

    return this.authApiService.logout(accessToken!).pipe(
      tap(() => this.authState.logout()),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  deleteMe(): Observable<void> {
    return this.authApiService.deleteMe().pipe(
      tap(() => this.authState.delete()),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
