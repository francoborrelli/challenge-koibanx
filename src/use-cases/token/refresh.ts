import { TOKEN_TYPES } from 'src/domain/constants/token';

import type { IUserRepository } from 'src/domain/interfaces/userRepository';
import type { ITokenRepository } from '../../domain/interfaces/tokenRepository';

export class Refresh {
  constructor(
    private tokenRepository: ITokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(refresh: string) {
    const refreshToken = await this.tokenRepository.verifyToken(refresh, TOKEN_TYPES.REFRESH);
    const user = await this.userRepository.findById(refreshToken.user);

    if (!user) throw new Error();

    await this.tokenRepository.deleteUserTokens(refreshToken.user, TOKEN_TYPES.REFRESH);

    const tokens = await this.tokenRepository.generateAuthTokens(user);
    return { user, tokens };
  }
}
