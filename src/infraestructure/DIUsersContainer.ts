import { MongoUserRepository } from './repositories/userRepository';

// User cases
import { GetUsers } from '../use-cases/user/getUsers';
import { CreateUser } from '../use-cases/user/createUser';
import { UpdateUser } from '../use-cases/user/updateUser';
import { DeleteUser } from '../use-cases/user/deleteUser';

class DIUsersContainer {
  private static _usersRepository = new MongoUserRepository();

  static getUsersRepository() {
    return this._usersRepository;
  }

  static getUsersUseCase() {
    return new GetUsers(this.getUsersRepository());
  }

  static getCreateUserUseCase() {
    return new CreateUser(this.getUsersRepository());
  }

  static getUpdateUserUseCase() {
    return new UpdateUser(this.getUsersRepository());
  }

  static getDeleteUserUseCase() {
    return new DeleteUser(this.getUsersRepository());
  }
}

export { DIUsersContainer };
