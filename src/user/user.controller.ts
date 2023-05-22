import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';
import { IUserController } from './user.controller.interface';
import { IUserService } from './user.service.interface';
import { NotFoundException } from '../errors/not-found-exception';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/list',
        method: 'get',
        func: this.list,
        middlewares: [new AuthGuard()]
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuard()]
      }
    ]);
  }

  async list(req: Request, res: Response, next: NextFunction) {
    const users = await this.userService.getUserList();
    this.ok(res, { users });
  }

  async info({ user }: Request, res: Response) {
    try {
      const userInfo = await this.userService.getUserInfo(user);
      this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.send(res, 404, error.message);
      }
    }
  }
}
