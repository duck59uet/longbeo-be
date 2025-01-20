import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceTimeDto {
  @ApiProperty({
    description: 'Service ID',
    required: true,
  })
  serviceId: number;

  @ApiProperty({
    description: 'Source service ID',
    required: true,
  })
  sourceServiceId: string;
}
