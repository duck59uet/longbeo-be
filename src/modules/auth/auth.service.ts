import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO } from './dto/login.dto';
import { UserRepository } from '../user/user.repository';
import { ContextProvider } from '../../providers/contex.provider';
import { AdminRepository } from '../admin/admin.repository';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private adminRepo: AdminRepository,
  ) {}

  async userLogin(loginDTO: LoginDTO): Promise<any> {
    let { username, password } = loginDTO;

    const verifyUser = await this.userRepo.verifyUser(username, password);

    if (!verifyUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const user = await this.userRepo.repo.findOne({ where: { username } });
    // Tôi cần bỏ trường password khi trả về response
    delete user.password;

    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username
    });

    return { token, user };
  }

  async adminLogin(loginDTO: LoginDTO): Promise<string> {
    let { username, password } = loginDTO;

    const verifyUser = await this.adminRepo.verifyAdmin(username, password);

    if (!verifyUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const user = await this.adminRepo.repo.findOne({ where: { username } });

    return await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username
    });
  }



  /**
   * getAuthUser
   * @returns
   */
  static getAuthUser() {
    return ContextProvider.getAuthUser();
  }
}
