import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @IsString({ message: 'Should be a string' })
  @ApiProperty()
  userId: string;
}
