import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import { Matches, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name',
  })
  fullname: string;

  @ApiProperty({
    description: 'Avatar',
  })
  avatar: string;

  @ApiProperty({
    description: 'Facebook',
  })
  facebook: string;
}
