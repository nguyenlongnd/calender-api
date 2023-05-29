import { Logger } from '@nestjs/common'

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { CustomeValidationPipe } from './exception/customValidation.exception'
import { AppModule } from './app/app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import { GlobalExceptionsFilter } from './exception/httpFilter.exception'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.disable('x-powered-by')
  app.useStaticAssets('public')
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  app.useGlobalPipes(
    new CustomeValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )
  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapterHost))
  app.use(cookieParser())
  app.enableCors({
    origin: true,
    credentials: true
  })

  // Global in
  const port = process.env.PORT || 3000

  const swaggerConfig = new DocumentBuilder().setTitle('Calendar APIs Docs').setVersion('1.0').build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/specs', app, document)

  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
