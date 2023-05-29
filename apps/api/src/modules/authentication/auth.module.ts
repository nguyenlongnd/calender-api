import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategy/jwt.strategy'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_TTL_IN_DAY}d` }
    })
  ],
  controllers: [],
  providers: [JwtStrategy]
})
export class AuthModule {}
