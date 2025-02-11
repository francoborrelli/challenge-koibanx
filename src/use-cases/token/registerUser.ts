import type { NewRegisteredUser } from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/interfaces/userRepository';
import type { ITokenRepository } from '../../domain/interfaces/tokenRepository';

export class RegisterUser {
  constructor(
    private tokenRepository: ITokenRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(userData: NewRegisteredUser) {
    const user = await this.userRepository.create(userData);
    const tokens = await this.tokenRepository.generateAuthTokens(user);
    return { user, tokens };
  }
}
