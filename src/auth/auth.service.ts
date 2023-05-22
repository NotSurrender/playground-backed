import { inject, injectable } from 'inversify';
import { compare, hash } from 'bcryptjs';
import { IConfigService } from '../config/config.service.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { IAuthRepository } from './auth.repository.interface';
import { TYPES } from '../types';
import { IAuthService } from './auth.service.interface';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) {}

  async createUser({ email, name, password }: AuthRegisterDto) {
    const existedUser = await this.authRepository.find(email);

    if (existedUser) {
      return null;
    }

    const salt = Number(this.configService.get('SALT'));
    const hashedPassword = await hash(password, salt);

    return await this.authRepository.create({
      name,
      email,
      password: hashedPassword
    });
  }

  async validateUser({ email, password }: AuthLoginDto) {
    const existedUser = await this.authRepository.find(email);

    if (!existedUser) {
      return false;
    }

    return await compare(password, existedUser.password);
  }

  async getUserInfo(email: string) {
    return this.authRepository.find(email);
  }
}
