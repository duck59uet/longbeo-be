import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Admin, AdminRole } from './entities/admin.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminRepository {
  private readonly logger = new Logger(AdminRepository.name);
  private salt: string;

  constructor(
    @InjectRepository(Admin)
    public repo: Repository<Admin>,
    private configService: ConfigService
  ) {
    this.logger.log(
      '============== Constructor Admin Repository ==============',
    );
    this.salt = this.configService.get<string>('SALT');
  }

  /**
   * getUsers
   * @param limit
   * @param skip
   * @returns
   */
  getUsers(limit: number, skip: number): Promise<Admin[]> {
    return this.repo.find({
      take: limit,
      skip,
    });
  }

  async getUser(username: string): Promise<Admin> {
    const qb = this.repo
      .createQueryBuilder('admin')
      .where({
        username,
        deletedAt: IsNull(),
      })

    return qb.getOne();
  }

  async createAdmin(
    username: string,
    fullname: string,
    password: string,
    phone: string,
  ): Promise<Admin> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new Admin();
    user.username = username;
    user.fullname = fullname;
    user.role = AdminRole.ADMIN;
    user.phone = phone;
    user.password = hashedPassword;
    return await this.repo.save(user);
  }

  async verifyAdmin(userName: string, password: string): Promise<boolean> {
    const user = await this.repo.findOne({where: {username: userName}});
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }
}
