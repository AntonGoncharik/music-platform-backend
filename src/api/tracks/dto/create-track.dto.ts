import { IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString({ message: 'Should be a string' })
  userId: string;
}
