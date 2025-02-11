import type { QueryResult } from '../entities/pagination';
import type { IUser, NewRegisteredUser } from '../entities/user';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: NewRegisteredUser): Promise<IUser>;
  update(id: string, user: IUser): Promise<void>;
  delete(id: string): Promise<void>;
  query(filter: Record<string, any>, options: any): Promise<QueryResult>;
  validateUserPassword(email: string, password: string): Promise<IUser | null>;
}
