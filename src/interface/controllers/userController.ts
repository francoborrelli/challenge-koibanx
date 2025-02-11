import httpStatus from 'http-status';

import { Request, Response } from 'express';
import { DIUsersContainer } from '../../infraestructure/DIUsersContainer';

// Utils
import pick from '../../shared/utils/pick';

// Interfaces
import type { IOptions } from '../../infraestructure/models/utils/paginate/paginate.types';

export class UserController {
  private _getUsers = DIUsersContainer.getUsersUseCase();
  private _createUser = DIUsersContainer.getCreateUserUseCase();
  private _updateUser = DIUsersContainer.getUpdateUserUseCase();
  private _deleteUser = DIUsersContainer.getDeleteUserUseCase();

  get = async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name', 'role']);
    const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const users = await this._getUsers.execute(filter, options);
    res.send(users);
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this._getUsers.executeById(id);
    res.send(user);
  };

  create = async (req: Request, res: Response) => {
    const user = await this._createUser.execute(req.body);
    res.status(httpStatus.CREATED).send(user);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this._updateUser.execute(id, req.body);
    res.send(user);
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this._deleteUser.execute(id);
    res.status(httpStatus.NO_CONTENT).send();
  };
}
