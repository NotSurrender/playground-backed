import { inject, injectable } from 'inversify';
import { SequelizeService } from '../database/sequelize.service';
import { TYPES } from '../types';
import { IAuthRepository } from './auth.repository.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(TYPES.SequelizeService) private sequelizeService: SequelizeService) {}

  async create(user: AuthRegisterDto) {
    return await this.sequelizeService.models.UserModel.create(user);
  }

  async find(email: string) {
    return await this.sequelizeService.models.UserModel.findOne({ where: { email } });
  }
}
