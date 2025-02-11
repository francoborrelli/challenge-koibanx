import mongoose, { Model } from 'mongoose';

// Interfaces
import type { IToken } from '../../domain/entities/token';

// Constants
import { TOKEN_TYPES } from '../../domain/constants/token';

// Utils
import toJSON from './utils/toJSON';

export interface ITokenDoc extends IToken, Document {}

export interface ITokenModel extends Model<ITokenDoc> {}

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [TOKEN_TYPES.REFRESH, TOKEN_TYPES.RESET_PASSWORD, TOKEN_TYPES.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

export const TokenModel = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);
