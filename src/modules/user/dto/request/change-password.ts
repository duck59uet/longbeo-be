import { ApiProperty } from '@nestjs/swagger';

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
