import type { IUser } from 'src/domain/entities/user';
import type { IUserRepository } from 'src/domain/interfaces/userRepository';

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, user: IUser) {
    return this.userRepository.update(id, user);
  }
}
