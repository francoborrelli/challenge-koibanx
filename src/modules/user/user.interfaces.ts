import mongoose, { Model, Document } from 'mongoose';

import type { IOptions, QueryResult } from '../paginate/paginate';
import type { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  /** @description The name of the user  */
  name: string;

  /** @description The email address of the user  */
  email: string;

  /** @description The password of the user  */
  password: string;

  /** @description The role of the user within the system  */
  role: string;

  /** @description Indicates whether the user's email has been verified  */
  isEmailVerified: boolean;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
