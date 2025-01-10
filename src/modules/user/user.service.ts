import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CommonUtil } from '../../utils/common.util';
import { CreateUserDto } from './dto/request/create-user.req';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/request/update-user.req';
import { ChangePasswordDto } from './dto/request/change-password';
import { TopupRepository } from '../topup/topup.repository';
import { OrderRepository } from '../order/order.repository';
import { BalanceRepository } from '../balance/balance.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(
    private userRepo: UserRepository,
    private topupRepo: TopupRepository,
    private orderRepo: OrderRepository,
    private balanceRepo: BalanceRepository,
  ) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async getUserInfo(): Promise<ResponseDto<User>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      const user = await this.userRepo.getUser(authInfo.id);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async createUser(request: CreateUserDto): Promise<ResponseDto<any>> {
    try {
      const { username, fullname, email, password, phone } = request;
      const userExist = await this.userRepo.getUser(username);
      if (userExist) {
        return ResponseDto.responseError(UserService.name, ErrorMap.USER_EXIST);
      }

      const user = await this.userRepo.createUser(username, fullname, email, password, phone);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }
}
