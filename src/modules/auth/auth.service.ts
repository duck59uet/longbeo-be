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

  async userLogIn(loginDTO: LoginDTO): Promise<string> {
    let { username, password } = loginDTO;

    // addr = standardizeAddress(addr);

    const verifyUser = await this.userRepo.verifyUser(username, password);

    if (!verifyUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const user = await this.userRepo.getUser(username);

    const data = { username: user.username, email: user.email };

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
