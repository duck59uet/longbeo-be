import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'Password',
  })
  newPassword: string;
}
