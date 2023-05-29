import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { entities } from '.'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),
        entities: entities,
        cli: {
          migrationsDir: __dirname + '/../database/migrations'
        },
        extra: {
          charset: 'utf8mb4_unicode_ci'
        },
        synchronize: configService.get('NODE_ENV') === 'development' ? true : false
      })
    })
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class TypeormConfigModule {}
