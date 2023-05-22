import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserService } from './user.service.interface';
import { IUserRepository } from './user.repository.interface';
import { NotFoundException } from '../errors/not-found-exception';
import { USER_NOT_FOUND_ERROR } from './user.constants';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async getUserList() {
    return this.userRepository.findAll();
  }

  async getUserInfo(email: string) {
    const existedUser = await this.userRepository.findOne(email);

    if (!existedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return existedUser;
  }
}
