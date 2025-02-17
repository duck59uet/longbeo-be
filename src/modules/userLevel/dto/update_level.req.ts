import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserLevelDto {
  @ApiProperty({
    description: 'id',
  })
  id: number;

  @ApiProperty({
    description: 'discount',
  })
  discount: number;
}
