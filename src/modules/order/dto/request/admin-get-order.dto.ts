import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AdminGetOrderRequestDto {
  @ApiProperty({
    example: 1,
  })
  categoryId: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 10,
  })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 1,
  })
  page: number = 1;
}
