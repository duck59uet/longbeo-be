import { ApiProperty } from '@nestjs/swagger';

export class UserIdRequestDto {
  @ApiProperty({
    example: 'aafa-2fsa',
  })
  id: string;
}
