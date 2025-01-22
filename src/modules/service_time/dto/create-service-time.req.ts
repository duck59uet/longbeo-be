import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceTimeDto {
  @ApiProperty({
    description: 'Service ID',
    required: true,
  })
  serviceId: number;

  @ApiProperty({
    description: 'Time',
    required: true,
  })
  time: string;

  @ApiProperty({
    description: 'Source service ID',
    required: true,
  })
  sourceServiceId: string;
}
