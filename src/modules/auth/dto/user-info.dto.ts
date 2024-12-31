import { UserRole } from '../../user/entities/user.entity';

export class UserInfoDto {
  id: string;

  address: string;

  role: UserRole;
}
