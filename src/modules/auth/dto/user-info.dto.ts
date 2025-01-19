import { UserRole } from "../../../common/constants/app.constant";

export class UserInfoDto {
  id: string;

  username: string;

  role: UserRole;
}
