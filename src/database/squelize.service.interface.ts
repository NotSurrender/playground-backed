import { UserModel } from '../common/user.model';

export interface SequelizeServiceModels {
  UserModel: typeof UserModel;
}

export interface ISequelizeService {
  models: SequelizeServiceModels | unknown;
}
