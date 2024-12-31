import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CommonUtil } from '../../utils/common.util';
import { CreateUserDto } from './dto/request/create-user.req';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private userRepo: UserRepository) {
    this.logger.log('============== Constructor User Service ==============');
  }

  async getUserInfo(): Promise<ResponseDto<User>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      const username = authInfo.username;
      const user = await this.userRepo.getUser(username);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async createUser(request: CreateUserDto): Promise<ResponseDto<User>> {
    try {
      const { userName, fullName, email, password } = request;
      const user = await this.userRepo.createUser(userName, fullName, email, password);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }
}
