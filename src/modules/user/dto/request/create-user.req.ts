import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
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
    description: 'Email',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  password: string;

  @ApiProperty({
    description: 'Phone number',
  })
  phone: string;

  @ApiProperty({
    description: 'Refer user',
  })
  @IsOptional()
  referUser: string;
}
