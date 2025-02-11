import type { IUser, NewCreatedUser } from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/interfaces/userRepository';

import { UserModel } from '../models/userModel';
import { IOptions, QueryResult } from '../models/utils/paginate/paginate.types';

export class MongoUserRepository implements IUserRepository {
  async findAll(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({
      email,
    });
  }

  async create(user: NewCreatedUser): Promise<IUser> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async update(user: IUser): Promise<void> {
    await UserModel.findByIdAndUpdate(user._id, user);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async query(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    return await UserModel.paginate(filter, options);
  }
}
