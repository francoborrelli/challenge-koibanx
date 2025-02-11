import jwt from 'jsonwebtoken';

// Utils
import mongoose from 'mongoose';
import dayjs, { Dayjs } from 'dayjs';

// Interfaces
import { ITokenDoc, TokenModel } from '../models/tokenModel';
import type { ITokenRepository } from 'src/domain/interfaces/tokenRepository';

// Constants
import config from '../../config';
import { TOKEN_TYPES, TokenTypesEnum } from '../../domain/constants/token';

export class MongoTokenRepository implements ITokenRepository {
  private secret: string;

  constructor(secret: string = config.jwt.secret) {
    this.secret = secret;
  }

  /**
   * Generate token
   * @param {mongoose.Types.ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  generateToken(userId: mongoose.Types.ObjectId, expires: Dayjs, type: string) {
    const payload = {
      sub: userId,
      iat: new Date().getTime(),
      exp: expires.toDate().getTime(),
      type,
    };
    return jwt.sign(payload, this.secret);
  }

  async saveToken(
    token: string,
    userId: mongoose.Types.ObjectId,
    expires: Dayjs,
    type: string,
    blacklisted: boolean = false
  ): Promise<ITokenDoc> {
    const tokenDoc = await TokenModel.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  }

  async verifyToken(token: string, type: string) {
    const payload = jwt.verify(token, config.jwt.secret);

    const tokenDoc = await TokenModel.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });

    if (!tokenDoc) {
      throw new Error('Token not found');
    }

    return tokenDoc;
  }

  async generateAuthTokens(userId: mongoose.Types.ObjectId) {
    const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = this.generateToken(userId, accessTokenExpires, TOKEN_TYPES.ACCESS);

    const refreshTokenExpires = dayjs().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = this.generateToken(userId, refreshTokenExpires, TOKEN_TYPES.REFRESH);
    await this.saveToken(refreshToken, userId, refreshTokenExpires, TOKEN_TYPES.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  async generateResetPasswordToken(userId: mongoose.Types.ObjectId) {
    const expires = dayjs().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = this.generateToken(userId, expires, TOKEN_TYPES.RESET_PASSWORD);
    await this.saveToken(resetPasswordToken, userId, expires, TOKEN_TYPES.RESET_PASSWORD);
    return resetPasswordToken;
  }

  async generateVerifyEmailToken(userId: mongoose.Types.ObjectId) {
    const expires = dayjs().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = this.generateToken(userId, expires, TOKEN_TYPES.VERIFY_EMAIL);
    await this.saveToken(verifyEmailToken, userId, expires, TOKEN_TYPES.VERIFY_EMAIL);
    return verifyEmailToken;
  }

  async deleteUserTokens(userId: mongoose.Types.ObjectId, type?: TokenTypesEnum) {
    await TokenModel.deleteMany({
      user: userId,
      type,
    });
  }
}
