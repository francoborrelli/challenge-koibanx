import type { IUser } from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/interfaces/userRepository';

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, user: IUser) {
    return this.userRepository.update(id, user);
  }
}
