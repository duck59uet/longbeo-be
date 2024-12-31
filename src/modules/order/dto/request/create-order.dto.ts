import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { OrderType } from '../../../../common/constants/app.constant';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  service_id: string;
}