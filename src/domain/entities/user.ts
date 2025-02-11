export interface IUser {
  _id: string;

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

  /** @description Method to check if the provided password matches the user's password */
  isPasswordMatch(password: string): Promise<boolean>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'isPasswordMatch' | '_id'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | '_id'>;
