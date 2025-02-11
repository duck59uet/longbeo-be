import { Module } from '@nestjs/common';
import { UserLevelController } from './userLevel.controller';
import { UserLevelService } from './userLevel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLevelRepository } from './userLevel.repository';
import { UserLevel } from './entities/userLevel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLevel])],
  controllers: [UserLevelController],
  providers: [UserLevelService, UserLevelRepository],
  exports: [UserLevelRepository]
})
export class UserLevelModule {}
