import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { PaymentMethod, TopupStatus } from '../../../../common/constants/app.constant';

export class CreateTopupDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sender: string;
}