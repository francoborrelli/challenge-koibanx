import { MongoUserRepository } from './repositories/userRepository';
import { MongoTokenRepository } from './repositories/tokenRepository';

// User cases
import { Login } from 'src/use-cases/token/login';
import { Refresh } from 'src/use-cases/token/refresh';
import { RegisterUser } from 'src/use-cases/token/registerUser';

class DITokenContainer {
  private static _usersRepository = new MongoUserRepository();
  private static _tokenRepository = new MongoTokenRepository();

  static getTokenRepository() {
    return this._tokenRepository;
  }

  static getUsersRepository() {
    return this._usersRepository;
  }

  static getLoginUseCase() {
    return new Login(this.getTokenRepository(), this.getUsersRepository());
  }

  static getRegisterUserUseCase() {
    return new RegisterUser(this.getTokenRepository(), this.getUsersRepository());
  }

  static getRefreshTokenUseCase() {
    return new Refresh(this.getTokenRepository(), this.getUsersRepository());
  }
}

export { DITokenContainer };
