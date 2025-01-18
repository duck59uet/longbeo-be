import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomConfigService } from '../../shared/services';
import { JwtStrategy } from './jwt.strategy';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (customConfigService: CustomConfigService) =>
        customConfigService.jwtConfig,
      inject: [CustomConfigService],
    }),
    UserModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
