import httpStatus from 'http-status';

import { Request, Response } from 'express';
import { DITokenContainer } from '../../infraestructure/DITokenContainer';

// Interfaces
import ApiError from '../../domain/entities/apiError';
import type { NewRegisteredUser } from '../../domain/entities/user';

export class TokenController {
  private _login = DITokenContainer.getLoginUseCase();
  private _refresh = DITokenContainer.getRefreshTokenUseCase();
  private _register = DITokenContainer.getRegisterUserUseCase();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this._login.execute(email, password);
    res.send(user);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      const user = await this._refresh.execute(refreshToken);
      res.send(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  };

  register = async (req: Request, res: Response) => {
    const body = req.body as NewRegisteredUser;
    const user = await this._register.execute(body);
    res.status(httpStatus.CREATED).send(user);
  };
}
