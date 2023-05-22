import { UserModel } from '../common/user.model';

export interface IUserRepository {
  findAll: () => Promise<UserModel[]>;
  findOne: (email: string) => Promise<UserModel | null>;
}
