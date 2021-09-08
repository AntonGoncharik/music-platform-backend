import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @IsString({ message: 'Should be a string' })
  @ApiProperty()
  refreshToken: string;
}
