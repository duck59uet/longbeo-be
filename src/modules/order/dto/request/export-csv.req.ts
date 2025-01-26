import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ExportCsvOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;
}