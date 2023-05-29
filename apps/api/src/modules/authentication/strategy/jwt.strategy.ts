import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Logger } from 'winston'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject('winston') private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies[process.env.TOKEN_KEY_COOKIE]
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET
    })
  }

  validate(payload: unknown) {
    this.logger.info(this.name.toString() + 'JWT Strategy validate %s' + JSON.stringify(payload))
    return payload
  }
}
