import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IAuthController } from './auth/auth.controller.interface';
import { AuthController } from './auth/auth.controller';
import { IAuthService } from './auth/auth.service.interface';
import { AuthService } from './auth/auth.service';
import { IAuthRepository } from './auth/auth.repository.interface';
import { AuthRepository } from './auth/auth.repository';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { SequelizeService } from './database/sequelize.service';
import { ISequelizeService } from './database/squelize.service.interface';
import { IUserController } from './user/user.controller.interface';
import { UserController } from './user/user.controller';
import { IUserService } from './user/user.service.interface';
import { UserService } from './user/user.service';
import { IUserRepository } from './user/user.repository.interface';
import { UserRepository } from './user/user.repository';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IAuthController>(TYPES.IAuthController).to(AuthController);
  bind<IAuthService>(TYPES.IAuthService).to(AuthService);
  bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
  bind<IUserController>(TYPES.IUserController).to(UserController);
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
  bind<ISequelizeService>(TYPES.SequelizeService).to(SequelizeService).inSingletonScope();
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

async function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return { appContainer, app };
}

export const boot = bootstrap();
