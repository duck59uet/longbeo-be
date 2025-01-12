import { ApiProperty } from '@nestjs/swagger';

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
