export const TYPES = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  IAuthController: Symbol.for('AuthController'),
  IAuthService: Symbol.for('AuthService'),
  AuthRepository: Symbol.for('AuthRepository'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  ConfigService: Symbol.for('ConfigService'),
  SequelizeService: Symbol.for('SequelizeService'),
  JwtStrategy: Symbol.for('JwtStrategy'),
  IUserController: Symbol.for('UserController'),
  IUserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository')
};
