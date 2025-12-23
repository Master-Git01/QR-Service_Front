export type OtpStatus = 'idle' | 'sending' | 'waitingCode' | 'verifying' | 'blocked';

export interface OtpState {
  phone?: string | null;
  maskedPhone?: string | null;

  status?: OtpStatus;

  attempts?: number; // попытки ввода
  sendCount?: number; // сколько раз отправляли код
  resendLeft?: number; // секунды до ресенда

  sending?: boolean;
  verifying?: boolean;

  error?: string | null;

  expiresAt?: number | null; // timestamp
  otpId?: string | null;
  message?: string;
}
