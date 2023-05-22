import { inject, injectable } from 'inversify';
import { SequelizeService } from '../database/sequelize.service';
import { IUserRepository } from './user.repository.interface';
import { TYPES } from '../types';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService) {}

  async findAll() {
    return this.sequelizeService.models.UserModel.findAll();
  }

  async findOne(email: string) {
    return this.sequelizeService.models.UserModel.findOne({ where: { email } });
  }
}
