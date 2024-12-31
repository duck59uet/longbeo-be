import { UserRole } from '../../user/entities/user.entity';

export class UserInfoDto {
  id: string;

  username: string;

  role: UserRole;
}
