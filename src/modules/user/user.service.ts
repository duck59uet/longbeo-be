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
import { AdminGetUsersRequestDto } from './dto/request/admin-get-user.req';
import { unparse } from 'papaparse';
import { DeleteUserRequestDto } from './entities/delete-user.req';
import { UserRole } from '../../common/constants/app.constant';

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
      const user = await this.userRepo.repo.findOne({
        where: { id: authInfo.id },
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async createUser(request: CreateUserDto): Promise<ResponseDto<any>> {
    try {
      const { username, fullname, email, password, phone, referUser } = request;
      const userExist = await this.userRepo.repo.findOne({
        where: { username },
      });
      if (userExist) {
        return ResponseDto.responseError(UserService.name, ErrorMap.USER_EXIST);
      }

      const user = await this.userRepo.createUser(
        username,
        fullname,
        email,
        password,
        phone,
        referUser,
      );

      const { password: userPassword, ...result } = user;
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async updateUser(body: UpdateUserDto): Promise<ResponseDto<any>> {
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

      const { password, ...result } = data;
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async changePassword(body: ChangePasswordDto): Promise<ResponseDto<any>> {
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

      const { password, ...result } = data;
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async getUserBalance(): Promise<ResponseDto<any>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();

      const balance = await this.balanceRepo.repo.findOne({
        where: { user_id: authInfo.id },
      });
      const topup = await this.topupRepo.getTopupById(authInfo.id);
      const order = await this.orderRepo.getOrderById(authInfo.id);

      const data = {
        balance: balance.balance,
        topup: Number(topup),
        order: Number(order),
      };

      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async adminGetUsers(req: AdminGetUsersRequestDto): Promise<ResponseDto<any>> {
    try {
      const data = await this.userRepo.adminGetUsers(req);
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async generateCsv(): Promise<any> {
    try {
      const data = await this.userRepo.exportUsersList();

      // Dữ liệu CSV
      const csvData = data.map((record: any) => ({
        'Tên tài khoản': record.username,
        'Tên đầy chủ': record.fullname,
        'Email': record.email,
        'Số điện thoại': record.phone,
        'Số dư': record.balance,
        'Tài khoản giới thiệu': record.refername,
        'Tên người giới thiệu': record.referfullname,
      }));

      // Tạo CSV string với BOM (UTF-8)
      const BOM = '\uFEFF';
      const csvContent = BOM + unparse(csvData, { header: true });

      return csvContent;
    } catch (error) {
      return ResponseDto.responseError(UserService.name, error);
    }
  }

  async deleteUser(req: DeleteUserRequestDto): Promise<ResponseDto<any>> {
      try {
        const { id } = req;
        const userLogin = this.commonUtil.getAuthInfo();
        if (userLogin.role === UserRole.USER) {
          return ResponseDto.responseError(
            UserService.name,
            ErrorMap.PERMISSION_DENIED,
          );
        }
  
        const user = await this.userRepo.repo.findOne({ where: { id } });
        if (!user) {
          return ResponseDto.responseError(
            UserService.name,
            ErrorMap.USER_NOT_FOUND,
          );
        }
  
        await this.userRepo.repo.update({ id }, { deletedAt: new Date() });
        return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
      } catch (error) {
        return ResponseDto.responseError(UserRepository.name, error);
      }
    }
}
