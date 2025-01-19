import { ApiProperty } from '@nestjs/swagger';

export class DeleteAdminRequestDto {
  @ApiProperty({
    example: 'aafa-2fsa',
  })
  id: string;
}
