import { inject, Injectable } from '@angular/core';
import { Auth } from '../interfaces/auth.interface';
import { BehaviorSubject, map } from 'rxjs';
import { LocalStorageService } from '../../../shared/utils/local-storage.service';
import { StorageKey } from '../../../shared/enums/storage-key.enum';
import { OtpState } from '../interfaces/otp.interface';
import { User } from '../../../shared/services/server/httb.service';
import { AuthPath } from '../enums/auth-status-path.enum';
import { OtpPath } from '../enums/otp-status-path.enum';

const initialOtp: OtpState = {
  phone: null,
  maskedPhone: null,
  status: 'idle',
  attempts: 0,
  sendCount: 0,
  resendLeft: 0,
  sending: false,
  verifying: false,
  error: null,
  expiresAt: null,
  otpId: null,
  message: '',
};

const initialAuthState: Auth = {
  status: 'anonymous',
  user: null,
  otp: null,
  token: null,
  loading: false,
};

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private readonly localStorage = inject(LocalStorageService);
  private readonly authState$$ = new BehaviorSubject<Auth>(this.loadFromStorage());

  readonly authState$ = this.authState$$.asObservable();
  readonly authStatus$ = this.authState$.pipe(map((state) => state.status));
  readonly user$ = this.authState$.pipe(map((state) => state.user));
  readonly otp$ = this.authState$.pipe(map((state) => state.otp));
  readonly isLoading$ = this.authState$.pipe(map((state) => state.loading));
  readonly isAuthenticated$ = this.authStatus$.pipe(map((status) => status === 'authenticated'));

  get state(): Auth {
    return this.authState$$.getValue();
  }

  get otp(): OtpState | null {
    return this.state.otp;
  }

  get user(): User | null {
    return this.state.user;
  }

  get accessToken(): string | null {
    return this.state.token;
  }

  /**
   * Инициализация процесса OTP (переход на экран ввода телефона)
   */
  setOtp(): void {
    this.updateState({
      status: AuthPath.OTP,
      otp: { ...initialOtp },
      loading: false,
    });
  }

  /**
   * Старт отправки кода
   */
  send(phone: string | null, masked: string | null): void {
    this.updateState({
      status: AuthPath.OTP,
      loading: true, // Включаем кружок загрузки
      otp: {
        ...initialOtp,
        phone,
        maskedPhone: masked,
        status: OtpPath.SENDING,
        sending: true,
      },
    });
  }

  /**
   * Код успешно отправлен
   */
  sendSuccess(otpId: string, expiresAt: number, message?: string): void {
    this.updateState({
      loading: false, // Выключаем кружок
      otp: {
        ...this.otp,
        status: OtpPath.WAITING_CODE,
        sending: false,
        sendCount: (this.otp?.sendCount ?? 0) + 1,
        resendLeft: 60,
        expiresAt,
        message,
        otpId,
      },
    });
  }

  /**
   * Старт верификации кода
   */
  verify(): void {
    this.updateState({
      loading: true, // Включаем кружок
      otp: {
        ...this.otp,
        status: OtpPath.VERIFYING,
        verifying: true,
        error: null,
      },
    });
  }

  /**
   * Успешный вход
   */
  verifySuccess(user: User, accessToken: string): void {
    this.updateState({
      status: AuthPath.AUTHENTICATED,
      user,
      otp: null,
      token: accessToken,
      loading: false,
    });
  }

  refreshSuccess(accessToken: string, user: User): void {
    this.updateState({
      user,
      status: AuthPath.AUTHENTICATED,
      token: accessToken,
      loading: false,
    });
  }

  /**
   * Полный сброс в анонимное состояние
   */
  logout(): void {
    this.setOtp();
  }

  delete(): void {
    this.reset();
  }

  reset(): void {
    this.updateState(initialAuthState);
  }

  private loadFromStorage(): Auth {
    const savedState = this.localStorage.get<Auth>(StorageKey.AUTH_STATE);

    // Если в сторадже что-то есть — берем, если нет — берем initialAuthState
    // Важно: мержим с initialAuthState, чтобы при обновлении структуры кода
    // старые данные в браузере пользователя не сломали приложение.
    return savedState ? { ...initialAuthState, ...savedState } : initialAuthState;
  }

  /**
   * Универсальный метод обновления стейта
   * Принимает только те поля, которые нужно изменить
   */
  private updateState(patch: Partial<Auth>): void {
    const newState: Auth = {
      ...this.authState$$.getValue(),
      ...patch,
    };

    this.authState$$.next(newState);
    this.localStorage.set(StorageKey.AUTH_STATE, newState);
  }
}
