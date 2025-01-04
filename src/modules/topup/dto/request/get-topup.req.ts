import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetTopupRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 10,
  })
  pageSize: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 1,
  })
  pageIndex: number;
}
