import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(20)
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  service: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;
}