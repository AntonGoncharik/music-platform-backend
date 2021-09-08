import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTrackDto {
  @IsString({ message: 'Should be a string' })
  @ApiProperty()
  id: string;
}
