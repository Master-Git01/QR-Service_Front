import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, tap } from 'rxjs';
import { LocalStorageService } from '../../../shared/utils/local-storage.service';
import { StorageKey } from '../../../shared/enums/storage-key.enum';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface OtpState {
  id: number | string | null;
  state: 'idle' | 'sending' | 'waitingCode' | 'verifying' | 'authenticated' | 'blocked';
  phone: string | null;
  attempts: number;
  sendCount: number;
  resendLeft: number;
  sending: boolean;
  verifying: boolean;
  error: string | null;
  lastSentAt: number | null;
  expiresAt: number | null;
  history: { type: string; ts: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private min = 1000;
  private max = 999999;

  private readonly http: HttpClient = inject(HttpClient);
  private readonly localStorage: LocalStorageService = inject(LocalStorageService);
  private router: Router = inject(Router);

  private isLoggedIn$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private telSaved$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private codeSaved$$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private otpState$$ = new BehaviorSubject<OtpState>({
    id: null,
    state: 'idle', // 'idle' | 'sending' | 'waitingCode' | 'verifying' | 'authenticated' | 'blocked'
    phone: null, // номер (маскировать при хранении/логах)
    attempts: 0, // попытки ввода кода
    sendCount: 0, // сколько раз просили OTP (rate-limit)
    resendLeft: 0, // таймер в секундах для ресенда (фронт)
    sending: false, // true пока идёт запрос send-otp
    verifying: false, // true пока идёт verify-otp
    error: null, // текст последней ошибки для показа
    lastSentAt: null, // timestamp когда отправляли OTP
    expiresAt: null, // timestamp когда OTP истекает (опционально)
    history: [], // лог событий [{type:'send',ts}, {type:'verify_fail',ts}, ...]
  });

  public otpState$ = this.otpState$$.asObservable();
  public telSaved$ = this.telSaved$$.asObservable();

  randomInt(): number {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }

  // send(phone: string): void {
  //   this.updateOtpState({
  //     ...this.otpState$$.value,
  //     state: 'sending',
  //     sending: true,
  //     phone,
  //     lastSentAt: Date.now(),
  //   });

  //   this.sendNumber();
  // }

  async verify(code: number): Promise<void> {
    this.updateOtpState({
      ...this.otpState$$.value,
      state: 'verifying',
      verifying: true,
    });

    try {
      setTimeout(() => {
        if (code === this.codeSaved$$.value) {
          if (!this.isLoggedIn$$.value) {
            console.log('Registering new user with phone:', this.telSaved$$.value);
            this.http
              .post('/users', { phone: this.telSaved$$.value })
              .pipe(
                delay(2000),
                tap(() => {
                  this.http
                    .get('/users', { params: { phone: this.telSaved$$.value } })
                    .pipe(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      map((user: any): any => {
                        return user[0] ? user[0] : {};
                      }),
                    )
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .subscribe((user: any): any => {
                      console.log('User = ', user);
                      this.updateOtpState({
                        ...this.otpState$$.value,
                        id: user.id,
                      });
                    });
                }),
              )
              .subscribe();
          }

          this.updateOtpState({
            ...this.otpState$$.value,
            state: 'authenticated',
            verifying: false,
            history: [...this.otpState$$.value.history, { type: 'verify', ts: Date.now() }],
          });

          this.router.navigate(['/auth/generate-dinamic-qr']);
        } else {
          this.updateOtpState({
            ...this.otpState$$.value,
            state: 'waitingCode',
            verifying: false,
            attempts: this.otpState$$.value.attempts + 1,
            history: [...this.otpState$$.value.history, { type: 'verify_fail', ts: Date.now() }],
          });

          alert('Неверный код. Попробуйте ещe раз.');
        }
      }, 2000);
    } catch (error) {
      alert('Ошибка при верификации.');
      console.error('Вот - ', error);
      this.updateOtpState({
        ...this.otpState$$.value,
        state: 'sending',
        verifying: false,
      });
    }
  }

  signup(phone: string): void {
    this.updateOtpState({
      ...this.otpState$$.value,
      state: 'sending',
      sending: true,
      phone,
      lastSentAt: Date.now(),
    });

    try {
      this.http
        .get('/users', { params: { phone: phone } })
        .pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map((user: any): any => {
            return user[0] ? user[0] : {};
          }),
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .subscribe((user: any): any => {
          this.isLoggedIn$$.next(user?.phone && user.phone === phone);

          if (this.isLoggedIn$$.value) {
            setTimeout(() => {
              return alert('Такой пользователь уже существует.');
            }, 2000);
          } else {
            this.telSaved$$.next(phone);
            this.sendCode();
          }
        });
    } catch (error) {
      alert('Ошибка при регистрации.');
      console.error('Вот - ', error);
      this.updateOtpState({
        ...this.otpState$$.value,
        state: 'idle',
        verifying: false,
      });
      this.router.navigate(['/signup']);
    }
  }

  login(phone: string): void {
    this.updateOtpState({
      ...this.otpState$$.value,
      state: 'sending',
      sending: true,
      phone,
      lastSentAt: Date.now(),
    });

    try {
      this.http
        .get('/users', { params: { phone: phone } })
        .pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map((user: any): any => {
            return user[0] ? user[0] : {};
          }),
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .subscribe((user: any): any => {
          this.isLoggedIn$$.next(user?.phone && user.phone === phone);

          if (this.isLoggedIn$$.value) {
            this.sendCode();
          } else {
            alert('Пользователь не найден.');
            this.updateOtpState({
              ...this.otpState$$.value,
              state: 'idle',
              verifying: false,
            });
            this.router.navigate(['/login']);
          }
        });
    } catch (error) {
      alert('Ошибка при входе.');
      console.error('Вот - ', error);
      this.updateOtpState({
        ...this.otpState$$.value,
        state: 'idle',
        verifying: false,
      });
      this.router.navigate(['/login']);
    }
  }

  delete(): void {
    const userId = this.otpState$$.value.id;
    console.log('Deleting user with ID:', userId);
    this.http
      .delete<void>(`/users/${userId}`)
      .pipe(
        tap(() => {
          this.resetOtpState();
          this.router.navigate(['/signup']);
        }),
      )
      .subscribe();
  }

  sendCode(): void {
    setTimeout(() => {
      this.updateOtpState({
        ...this.otpState$$.value,
        state: 'waitingCode',
        sending: false,
        sendCount: this.otpState$$.value.sendCount + 1,
        history: [...this.otpState$$.value.history, { type: 'send', ts: Date.now() }],
      });

      const code = this.randomInt();

      this.codeSaved$$.next(code);

      alert(`Ваш код подтверждения: ${code}`);
    }, 2000);
  }

  resetOtpState(): void {
    this.updateOtpState({
      ...this.otpState$$.value,
      id: null,
      state: 'idle',
      phone: null,
      attempts: 0,
      sendCount: 0,
    });
  }

  updateOtpState(otpState: OtpState): void {
    this.localStorage.set(StorageKey.OTP_STATE, otpState);
    this.otpState$$.next(otpState);
  }

  logout(): void {
    this.resetOtpState();
    this.router.navigate(['/login']);
  }
}
