import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO } from './dto/login.dto';
import { UserRepository } from '../user/user.repository';
import { ContextProvider } from '../../providers/contex.provider';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}

  async userLogIn(loginDTO: LoginDTO): Promise<{ token: string; user: any }> {
    let { username, password } = loginDTO;

    // addr = standardizeAddress(addr);

    const verifyUser = await this.userRepo.verifyUser(username, password);

    if (!verifyUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const user = await this.userRepo.getUser(username);

    const data = { name: user.username, email: user.email };

    const token = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      username: user.username
    });

    return { token: token, user: data };
  }

  /**
   * getAuthUser
   * @returns
   */
  static getAuthUser() {
    return ContextProvider.getAuthUser();
  }
}
