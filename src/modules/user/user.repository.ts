import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminGetUsersRequestDto } from './dto/request/admin-get-user.req';
import { Balance } from '../balance/entities/balance.entity';

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
    phone: string,
  ): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User();
    user.username = username;
    user.fullname = fullname;
    user.role = UserRole.USER;
    user.email = email;
    user.phone = phone;
    user.password = hashedPassword;
    return await this.repo.save(user);
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const user = await this.repo.findOne({where: {username: userName, role: UserRole.USER}});
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }

  async adminGetUsers(req: AdminGetUsersRequestDto) {
    const { page, limit } = req;
    const sql = this.repo
      .createQueryBuilder('user')
      .leftJoin(Balance, 'balance', 'balance.user_id = user.id')
      .where('user.role = :role', { role: UserRole.USER })
      .select([
        'user.id',
        'user.username',
        'user.fullname',
        'user.email',
        'user.phone',
        'user.role',
        'balance.balance',
      ]);

    if (req.username) {
      sql.andWhere('user.username LIKE :username', { username: `%${req.username}%` });
    }

    const [count, item] = await Promise.all([
      sql.getCount(),
      sql.skip(limit * (page - 1)).take(limit).getMany(),
    ]);

    return [count, item];
  }
}
