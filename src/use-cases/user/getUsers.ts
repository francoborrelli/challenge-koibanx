import type { IUserRepository } from 'src/domain/interfaces/userRepository';

export class GetUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(filters: any, options: any) {
    return this.userRepository.query(filters, options);
  }

  async executeById(id: string) {
    return this.userRepository.findById(id);
  }

  async executeByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
