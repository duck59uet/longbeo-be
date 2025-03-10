import { ApiProperty } from '@nestjs/swagger';

export class GetUserPathParamDto {
  @ApiProperty({
    description: 'id',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Level',
  })
  level: number;
}
