import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Web3LoginDTO } from './dto/web3-login.dto';
import { isValidUserSignature } from '../../decorators/wallet.decorators';
import { UserRepository } from '../user/user.repository';
import { ContextProvider } from '../../providers/contex.provider';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}

  async userLogIn(loginDTO: Web3LoginDTO): Promise<string> {
    let { addr, message, signature } = loginDTO;

    // addr = standardizeAddress(addr);

    if (!isValidUserSignature(addr, message, signature)) {
      throw new UnauthorizedException('Invalid Signature');
    }

    const user = await this.userRepo.getUserByAddress(addr);
    if (user === null) {
      throw new BadRequestException('User not found');
    }

    return await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
      address: addr
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
