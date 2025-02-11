import type { IUserRepository } from '../../domain/interfaces/userRepository';
import type { ITokenRepository } from '../../domain/interfaces/tokenRepository';

export class Login {
  constructor(
    private tokenRepository: ITokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.validateUserPassword(email, password);
    const tokens = await this.tokenRepository.generateAuthTokens(user);
    return { user, tokens };
  }
}
