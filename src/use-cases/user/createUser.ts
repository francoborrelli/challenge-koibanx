import type { NewCreatedUser } from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/interfaces/userRepository';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: NewCreatedUser) {
    return this.userRepository.create(userData);
  }
}
