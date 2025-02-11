import type { QueryResult } from '../entities/pagination';
import type { IUser, NewCreatedUser } from '../entities/user';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: NewCreatedUser): Promise<IUser>;
  update(user: IUser): Promise<void>;
  delete(id: string): Promise<void>;
  query(filter: Record<string, any>, options: any): Promise<QueryResult>;
}
