import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTrackToUserDto {
  @IsString({ message: 'Should be a string' })
  @ApiProperty()
  userId: string;

  @IsString({ message: 'Should be a string' })
  @ApiProperty()
  id: string;
}
