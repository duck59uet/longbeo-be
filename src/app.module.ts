import { CacheModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { CustomConfigService } from './shared/services';
import { OrderModule } from './modules/order/order.module';
import { TopupModule } from './modules/topup/topup.module';
import { ServiceModule } from './modules/service/service.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServiceTimeModule } from './modules/service_time/service_time.module';
import { CategoryModule } from './modules/category/category.module';
import { UserLevelModule } from './modules/userLevel/userLevel.module';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CacheModule.register({ ttl: 10_000 }),
    SharedModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_URL'),
          port: configService.get('REDIS_PORT'),
          db: configService.get('REDIS_DB'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (customConfigService: CustomConfigService) =>
        customConfigService.typeOrmConfig,
      inject: [CustomConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    OrderModule,
    TopupModule,
    ServiceModule,
    AdminModule,
    ServiceTimeModule,
    CategoryModule,
    UserLevelModule,
    ApiModule,
  ],
  providers: [JwtStrategy],
  controllers: [],
})
export class AppModule {}
