import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends Strategy {
  constructor(private secret: string) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
      },
      (token, done) => {
        return done(null, token);
      }
    );

    return this;
  }
}
