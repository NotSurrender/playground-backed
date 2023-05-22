import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  list: (req: Request, res: Response, next: NextFunction) => void;
  info: (req: Request, res: Response, next: NextFunction) => void;
}
