import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserModel } from '../common/user.model';

export interface IAuthRepository {
  create: (user: AuthRegisterDto) => Promise<UserModel>;
  find: (email: string) => Promise<UserModel | null>;
}
