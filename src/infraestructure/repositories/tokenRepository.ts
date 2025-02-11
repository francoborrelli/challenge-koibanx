import jwt from 'jsonwebtoken';

// Utils
import mongoose from 'mongoose';
import dayjs, { Dayjs } from 'dayjs';

// Interfaces
import { ITokenDoc, TokenModel } from '../models/tokenModel';
import type { AccessAndRefreshTokens } from '../../domain/entities/token';
import type { ITokenRepository } from '../../domain/interfaces/tokenRepository';

// Constants
import config from '../../config';
import { TOKEN_TYPES, TokenTypesEnum } from '../../domain/constants/token';

export class MongoTokenRepository implements ITokenRepository {
  /** @description The secret key used to sign JWT tokens */
  private secret: string;

  constructor(secret: string = config.jwt.secret) {
    this.secret = secret;
  }

  /**
   * Generate token
   * @param {mongoose.Types.ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
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

  /**
   * Save a token
   * @param {string} token
   * @param {mongoose.Types.ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<ITokenDoc>}
   */
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

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<ITokenDoc>}
   */
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

  /**
   * Generate a token for a specific purpose
   * @param {mongoose.Types.ObjectId} userId
   * @param {string} type
   * @param {number} expirationMinutes
   * @returns {Promise<string>}
   */
  private async generateSpecificToken(
    userId: mongoose.Types.ObjectId,
    type: string,
    expirationMinutes: number
  ): Promise<string> {
    const expires = dayjs().add(expirationMinutes, 'minutes');
    const token = this.generateToken(userId, expires, type);
    await this.saveToken(token, userId, expires, type);
    return token;
  }

  /**
   * Generate reset password token
   * @param {mongoose.Types.ObjectId} userId
   * @returns {Promise<string>}
   */
  async generateResetPasswordToken(userId: mongoose.Types.ObjectId): Promise<string> {
    return this.generateSpecificToken(userId, TOKEN_TYPES.RESET_PASSWORD, config.jwt.resetPasswordExpirationMinutes);
  }

  /**
   * Generate verify email token
   * @param {mongoose.Types.ObjectId} userId
   * @returns {Promise<string>}
   */
  async generateVerifyEmailToken(userId: mongoose.Types.ObjectId): Promise<string> {
    return this.generateSpecificToken(userId, TOKEN_TYPES.VERIFY_EMAIL, config.jwt.verifyEmailExpirationMinutes);
  }

  /**
   * Generate auth tokens
   * @param {mongoose.Types.ObjectId} userId
   * @returns {Promise<AccessAndRefreshTokens>}
   */
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
    } as AccessAndRefreshTokens;
  }

  async deleteUserTokens(userId: mongoose.Types.ObjectId, type?: TokenTypesEnum) {
    await TokenModel.deleteMany({
      user: userId,
      type,
    });
  }
}
