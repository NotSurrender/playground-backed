import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleware } from '../common/middleware.interface';

export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {}

  execute(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      verify(token, this.secret, (err, payload) => {
        if (err) {
          return next();
        } else if (payload) {
          if (typeof payload === 'object') {
            req.user = payload.email;
            return next();
          }
        }
      });
    } else {
      return next();
    }
  }
}
