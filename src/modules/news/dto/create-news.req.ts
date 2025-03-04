import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  avatar: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: Object;

  @ApiProperty()
  status: boolean;
}