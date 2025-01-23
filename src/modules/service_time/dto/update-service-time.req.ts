import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceTimeDto {
  @ApiProperty({
    description: 'Time',
  })
  time: string;

  @ApiProperty({
    description: 'Service ID',
  })
  sourceServiceId: string;
}
