import { User } from '../../../shared/services/server/httb.service';

export interface SendOtpResponse {
  otpId: string;
  expiresAt: number; // Unix timestamp в секундах
  message?: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: User;
}

export interface AuthErrorResponse {
  error: string;
  code: string;
  attemptsLeft?: number;
}
