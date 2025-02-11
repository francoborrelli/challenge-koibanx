import { TokenTypesEnum } from '../constants/token';
import type { AccessAndRefreshTokens } from '../entities/token';

export interface ITokenRepository {
  generateToken(userId: any, expires: any, type: string): string;
  verifyToken(token: string, type: string): Promise<{ user: any }>;
  saveToken(token: string, userId: any, expires: any, type: string, blacklisted: boolean): Promise<any>;
  generateAuthTokens(userId: any): Promise<AccessAndRefreshTokens>;
  generateResetPasswordToken(userId: any): Promise<string>;
  generateVerifyEmailToken(userId: any): Promise<string>;
  deleteUserTokens(userId: any, type?: TokenTypesEnum): Promise<void>;
}
