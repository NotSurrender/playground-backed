import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { IAuthController } from './auth.controller.interface';
import { IAuthService } from './auth.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class AuthController extends BaseController implements IAuthController {
  constructor(
    @inject(TYPES.ILogger) private loggerService: ILogger,
    @inject(TYPES.IAuthService) private authService: IAuthService,
    @inject(TYPES.ConfigService) private configService: IConfigService
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/register',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(AuthRegisterDto)]
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(AuthLoginDto)]
      },
      {
        path: '/info',
        method: 'get',
        func: this.info,
        middlewares: [new AuthGuard()]
      }
    ]);
  }

  async login({ body }: Request<{}, {}, AuthLoginDto>, res: Response, next: NextFunction) {
    const result = await this.authService.validateUser(body);

    if (!result) {
      return next(new HTTPError(401, 'Unauthorized', 'login'));
    }

    const jwt = await this.signJWT(body.email, this.configService.get('JWT_SECRET'));

    this.ok(res, { jwtRes: jwt });
  }

  async register({ body }: Request<{}, {}, AuthRegisterDto>, res: Response, next: NextFunction) {
    const result = await this.authService.createUser(body);

    if (!result) {
      return next(new HTTPError(422, 'This email is already registered'));
    }

    const jwt = await this.signJWT(result.email, this.configService.get('JWT_SECRET'));

    this.ok(res, { jwtRes: jwt });
  }

  async info({ user }: Request, res: Response) {
    const userInfo = await this.authService.getUserInfo(user);
    this.ok(res, { email: userInfo?.email, name: userInfo?.name });
  }

  private signJWT(email: string, secret: string) {
    return new Promise((resolve, reject) => {
      sign(
        {
          email,
          iat: Math.floor(Date.now() / 1000)
        },
        secret,
        { algorithm: 'HS256' },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  }
}
