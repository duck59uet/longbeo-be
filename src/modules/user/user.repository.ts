import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private salt: string;

  constructor(
    @InjectRepository(User)
    public repo: Repository<User>,
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
    username: string,
    fullname: string,
    email: string,
    password: string,
  ): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User();
    user.username = username;
    user.fullname = fullname;
    user.role = UserRole.USER;
    user.email = email;
    user.password = hashedPassword;
    return await this.repo.save(user);
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const user = await this.repo.findOne({where: {username: userName}});
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }
}
