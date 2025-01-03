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
      const { username, fullname, email, password } = request;
      const userExist = await this.userRepo.getUser(username);
      if (userExist) {
        return ResponseDto.responseError(UserService.name, ErrorMap.USER_EXIST);
      }

      const user = await this.userRepo.createUser(
        username,
        fullname,
        email,
        password,
      );
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async updateUser(body: UpdateUserDto): Promise<ResponseDto<User>> {
    try {
      const userId = this.commonUtil.getAuthInfo().id;

      const user = await this.userRepo.repo.findOne({
        where: { id: userId },
      });

      if (!user) {
        return ResponseDto.responseError(
          UserService.name,
          ErrorMap.USER_NOT_FOUND,
        );
      }

      const { fullname, avatar, facebook } = body;

      user.fullname = fullname;
      user.avatar = avatar;
      user.facebook = facebook;

      const data = await this.userRepo.repo.save(user);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async changePassword(body: ChangePasswordDto): Promise<ResponseDto<User>> {
    try {
      const userId = this.commonUtil.getAuthInfo().id;

      const user = await this.userRepo.repo.findOne({
        where: { id: userId },
      });

      if (!user) {
        return ResponseDto.responseError(
          UserService.name,
          ErrorMap.USER_NOT_FOUND,
        );
      }

      const { oldPassword, newPassword } = body;

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return ResponseDto.responseError(
          UserService.name,
          ErrorMap.WRONG_PASSWORD,
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;

      const data = await this.userRepo.repo.save(user);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }
}
