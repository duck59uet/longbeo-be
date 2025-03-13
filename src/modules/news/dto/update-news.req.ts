import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: Object;

  @ApiProperty()
  status: boolean;
}