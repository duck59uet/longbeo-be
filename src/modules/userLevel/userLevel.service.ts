import { Injectable, Logger } from '@nestjs/common';
import { UserLevelRepository } from './userLevel.repository';
import { CommonUtil } from '../../utils/common.util';
import { ResponseDto } from '../../common/dtos';
import { ErrorMap } from '../../common/error.map';
import { UpdateUserLevelDto } from './dto/update_level.req';

@Injectable()
export class UserLevelService {
  private readonly logger = new Logger(UserLevelService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private userLevelRepo: UserLevelRepository) {
    this.logger.log(
      '============== Constructor UserLevel Service ==============',
    );
  }

  async getUserLevel(): Promise<ResponseDto<any>> {
    try {
      const userLevel = await this.userLevelRepo.repo.find();
      return ResponseDto.response(ErrorMap.SUCCESSFUL, userLevel);
    } catch (error) {
      return ResponseDto.responseError(UserLevelService.name, error);
    }
  }

  async updateUserLevel(req: UpdateUserLevelDto): Promise<ResponseDto<any>> {
    try {
      const { id, discount } = req;

      const userLevel = await this.userLevelRepo.repo.findOne({
        where: { id },
      });
      if (!userLevel) {
        return ResponseDto.responseError(UserLevelService.name, ErrorMap.USER_LEVEL_NOT_FOUND);
      }

      const result = await this.userLevelRepo.repo.update({ id }, { discount });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(UserLevelService.name, error);
    }
  }
}
