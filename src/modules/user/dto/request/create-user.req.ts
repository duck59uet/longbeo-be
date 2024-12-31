import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import { Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    type: String,
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username can only contain letters and numbers',
  })
  userName: string;

  @ApiProperty({
    description: 'Full name',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  password: string;
}
