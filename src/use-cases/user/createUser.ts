import type { NewCreatedUser } from 'src/domain/entities/user';
import type { IUserRepository } from 'src/domain/interfaces/userRepository';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: NewCreatedUser) {
    return this.userRepository.create(userData);
  }
}
