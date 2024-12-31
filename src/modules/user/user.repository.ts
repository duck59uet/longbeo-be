import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js' 

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private salt: string;

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private configService: ConfigService
  ) {
    this.logger.log(
      '============== Constructor User Repository ==============',
    );
    this.salt = this.configService.get<string>('SALT');
  }

  /**
   * getUsers
   * @param limit
   * @param skip
   * @returns
   */
  getUsers(limit: number, skip: number): Promise<User[]> {
    return this.repo.find({
      take: limit,
      skip,
    });
  }

  async getUser(username: string): Promise<User> {
    const qb = this.repo
      .createQueryBuilder('users')
      .where({
        username,
        deletedAt: IsNull(),
      })

    return qb.getOne();
  }

  async createUser(
    userName: string,
    fullName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const encryptedPassword = CryptoJS.AES.encrypt(password, this.salt).toString();
    const user = new User();
    user.username = userName;
    user.fullName = fullName;
    user.role = UserRole.USER;
    user.email = email;
    user.password = encryptedPassword;
    return await this.repo.save(user);
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const user = await this.repo.findOne({where: {username: userName}});
    const hashedInput = CryptoJS.AES.encrypt(password, this.salt).toString();
    return hashedInput === user.password;
  }
}
