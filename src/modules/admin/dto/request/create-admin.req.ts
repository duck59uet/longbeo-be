import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../../entities/admin.entity';
import { Matches, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Username',
    type: String,
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username can only contain letters and numbers',
  })
  username: string;

  @ApiProperty({
    description: 'Full name',
  })
  fullname: string;

  @ApiProperty({
    description: 'Password',
  })
  password: string;

  @ApiProperty({
    description: 'Phone number',
  })
  phone: string;
}
