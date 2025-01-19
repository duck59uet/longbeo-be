import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Service Name',
  })
  name: string;

  @ApiProperty({
    description: 'Price',
    type: 'double',
  })
  price: number;

  @ApiProperty({
    description: 'Service ID',
  })
  sourceServiceId: string;

  @ApiProperty({
    description: 'Source Address',
  })
  sourceAddress: string;

  @ApiProperty({
    description: 'rate',
    type: 'double',
  })
  rate: number;
}
