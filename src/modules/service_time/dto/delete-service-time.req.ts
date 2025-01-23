import { ApiProperty } from '@nestjs/swagger';

export class DeleteServiceTimeDto {
  @ApiProperty({
    description: 'id',
    required: true,
  })
  id: number;
}
