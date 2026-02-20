import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),

      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      email: payload.email,
    };
  }
}
