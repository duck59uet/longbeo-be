import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ApiDto {
  @ApiProperty({
    description: 'key',
  })
  key: string;

  @ApiProperty({
    description: 'action',
  })
  action: string;

  @ApiProperty({
    description: 'service',
    required: false,
  })
  @IsOptional()
  service: number;

  @ApiProperty({
    description: 'link',
    required: false,
  })
  @IsOptional()
  link: string;

  @ApiProperty({
    description: 'quantity',
    required: false,
  })
  @IsOptional()
  quantity: number;

  @ApiProperty({
    description: 'order',
    required: false,
  })
  @IsOptional()
  order: number;

  @ApiProperty({
    description: 'orders',
    required: false,
  })
  @IsOptional()
  orders: string;
}
