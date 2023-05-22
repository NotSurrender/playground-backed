import { UserModel } from '../common/user.model';

export interface IUserService {
  getUserList: () => Promise<UserModel[]>;
  getUserInfo: (email: string) => Promise<UserModel>;
}
