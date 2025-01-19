import { Injectable, Logger } from '@nestjs/common';
import { ResponseDto } from '../../common/dtos/response.dto';
import { ErrorMap } from '../../common/error.map';
import { AdminRepository } from './admin.repository';
import { Admin } from './entities/admin.entity';
import { CommonUtil } from '../../utils/common.util';
import { CreateAdminDto } from './dto/request/create-admin.req';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/request/change-password';
import { UserRole } from '../../common/constants/app.constant';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly commonUtil: CommonUtil = new CommonUtil();

  constructor(private adminRepo: AdminRepository) {
    this.logger.log('============== Constructor Admin Service ==============');
  }

  async getAdminInfo(): Promise<ResponseDto<Admin>> {
    try {
      const authInfo = this.commonUtil.getAuthInfo();
      const user = await this.adminRepo.repo.findOne({
        where: { id: authInfo.id },
      });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, user);
    } catch (error) {
      return ResponseDto.responseError(AdminService.name, error);
    }
  }

  async createAdmin(request: CreateAdminDto): Promise<ResponseDto<any>> {
    try {
      const userLogin = this.commonUtil.getAuthInfo();
      if (userLogin.role !== UserRole.SUPERADMIN) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }

      const { username, fullname, password, phone } = request;
      const userExist = await this.adminRepo.repo.findOne({
        where: { username },
      });
      if (userExist) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.USER_EXIST,
        );
      }

      const admin = await this.adminRepo.createAdmin(
        username,
        fullname,
        password,
        phone,
      );

      const { password: userPassword, ...result } = admin;
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(AdminService.name, error);
    }
  }

  async changePassword(body: ChangePasswordDto): Promise<ResponseDto<any>> {
    try {
      const userId = this.commonUtil.getAuthInfo().id;

      const user = await this.adminRepo.repo.findOne({
        where: { id: userId },
      });

      if (!user) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.USER_NOT_FOUND,
        );
      }

      const { oldPassword, newPassword } = body;

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.WRONG_PASSWORD,
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;

      const data = await this.adminRepo.repo.save(user);

      const { password, ...result } = data;
      return ResponseDto.response(ErrorMap.SUCCESSFUL, result);
    } catch (error) {
      return ResponseDto.responseError(AdminService.name, error);
    }
  }

  async listAdmin(): Promise<ResponseDto<Admin[]>> {
    try {
      let data: Admin[];
      if (this.commonUtil.getAuthInfo().role === 'admin') {
        data = await this.adminRepo.repo.find({
          where: {
            role: UserRole.ADMIN,
            username: this.commonUtil.getAuthInfo().username,
          },
        });
      } else {
        data = await this.adminRepo.repo.find();
      }
      return ResponseDto.response(ErrorMap.SUCCESSFUL, data);
    } catch (error) {
      return ResponseDto.responseError(AdminService.name, error);
    }
  }

  async deleteAdmin(id: string): Promise<ResponseDto<any>> {
    try {
      const userLogin = this.commonUtil.getAuthInfo();
      if (userLogin.role !== UserRole.SUPERADMIN) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.PERMISSION_DENIED,
        );
      }

      const user = await this.adminRepo.repo.findOne({ where: { id } });
      if (!user) {
        return ResponseDto.responseError(
          AdminService.name,
          ErrorMap.USER_NOT_FOUND,
        );
      }

      await this.adminRepo.repo.update({ id }, { deletedAt: new Date() });
      return ResponseDto.response(ErrorMap.SUCCESSFUL, {});
    } catch (error) {
      return ResponseDto.responseError(AdminService.name, error);
    }
  }
}
