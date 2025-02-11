export interface IToken {
  /** @description The token string */
  token: string;

  /** @description The user associated with the token */
  user: string;

  /** @description The type of the token */
  type: string;

  /** @description The expiration date of the token */
  expires: Date;

  /** @description Indicates if the token is blacklisted */
  blacklisted: boolean;
}

export type NewToken = Omit<IToken, 'blacklisted'>;

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AccessAndRefreshTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
