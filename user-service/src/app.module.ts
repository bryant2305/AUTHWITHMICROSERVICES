import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { HealthCheckModule } from './health-check/health-check.module';
import typeorm from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UserModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static redisHost: string;
  static redisPort: number;
  static redisPassword: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.redisHost = this.configService.get<string>('REDIS_HOST');
    AppModule.redisPort = this.configService.get<number>('REDIS_PORT');
    AppModule.redisPassword = this.configService.get<string>('REDIS_PASSWORD');
  }
}
