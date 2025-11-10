import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { API_GLOBAL_PREFIX } from './common/constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(API_GLOBAL_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Custome Dashboard ')
    .setDescription('custome dashboard API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  //  create a full document (with all HTTP routes defined)
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      servers: [
        {
          url: `/${API_GLOBAL_PREFIX}`,
        },
      ],
    },
  });

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  await app.listen(port);
  Logger.log(`Application is running on:: ${await app.getUrl()}`);
}
bootstrap();
