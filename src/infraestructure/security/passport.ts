// Models
import { DIUsersContainer } from '../DIUsersContainer';

// Config
import config from '../../config';

// Constants
import { TOKEN_TYPES } from '../../domain/constants/token';

// Interfaces
import type { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== TOKEN_TYPES.ACCESS) {
        throw new Error('Invalid token type');
      }
      const getUsers = DIUsersContainer.getUsersUseCase();
      const user = await getUsers.executeById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
