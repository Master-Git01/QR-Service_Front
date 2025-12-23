import { User } from '../../../shared/services/server/httb.service';
import { OtpState } from './otp.interface';

export type AuthStatus = 'anonymous' | 'otp' | 'authenticated';

export interface Auth {
  status: AuthStatus;

  user: User | null;

  otp: OtpState | null;

  token: string | null;

  loading: boolean;
}
