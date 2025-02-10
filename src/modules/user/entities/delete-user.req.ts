import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserRequestDto {
  @ApiProperty({
    example: 'aafa-2fsa',
  })
  id: string;
}
