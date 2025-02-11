import httpStatus from 'http-status';

import { Request, Response } from 'express';
import { DIUsersContainer } from '../../infraestructure/DIUsersContainer';

// Utils
import { pick } from '../../shared/utils';

// Interfaces
import type { IOptions } from '../../infraestructure/models/utils/paginate/paginate.types';

export class UserController {
  private _getUsers = DIUsersContainer.getUsersUseCase();
  private _createUser = DIUsersContainer.getCreateUserUseCase();
  private _updateUser = DIUsersContainer.getUpdateUserUseCase();
  private _deleteUser = DIUsersContainer.getDeleteUserUseCase();

  async get(req: Request, res: Response) {
    const filter = pick(req.query, ['name', 'role']);
    const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
    const users = await this._getUsers.execute(filter, options);
    res.send(users);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this._getUsers.executeById(id);
    res.send(user);
  }

  async create(req: Request, res: Response) {
    const user = await this._createUser.execute(req.body);
    res.status(httpStatus.CREATED).send(user);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this._updateUser.execute(id, req.body);
    res.send(user);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this._deleteUser.execute(id);
    res.status(httpStatus.NO_CONTENT).send();
  }
}
