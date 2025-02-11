import type { IUserRepository } from '../../domain/interfaces/userRepository';

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: string) {
    return this.userRepository.delete(user);
  }
}
