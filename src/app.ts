import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import passport, { PassportStatic } from 'passport';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { AuthController } from './auth/auth.controller';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IConfigService } from './config/config.service.interface';
import { SequelizeService } from './database/sequelize.service';
import { UserController } from './user/user.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtStrategy } from './auth/strategies/jwt-strategy';
import 'reflect-metadata';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;
  passport: PassportStatic;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IAuthController) private authController: AuthController,
    @inject(TYPES.IUserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.SequelizeService) private sequelizeService: SequelizeService
  ) {
    this.app = express();
    this.port = Number(this.configService.get('PORT'));
    this.passport = passport;
  }

  useMiddlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(json());
    const authMiddleware = new AuthMiddleware(this.configService.get('JWT_SECRET'));
    this.app.use(authMiddleware.execute.bind(authMiddleware));
    this.app.use(passport.initialize());
  }

  useRoutes() {
    this.app.use('/auth', this.authController.router);
    this.app.use('/user', this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  usePassportStrategies() {
    this.passport.use(new JwtStrategy(this.configService.get('JWT_SECRET')));
  }

  public async init() {
    this.useMiddlewares();
    this.useRoutes();
    this.useExceptionFilters();
    this.usePassportStrategies();
    await this.sequelizeService.connect();
    this.server = this.app.listen(this.port);
    this.logger.log('Server started on port ', this.port);
  }

  public close() {
    this.server.close();
  }
}
