import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceTimeDto {
  @ApiProperty({
    description: 'Service ID',
  })
  sourceServiceId: string;
}
