import { IsString } from 'class-validator';

export class DeleteTrackDto {
  @IsString({ message: 'Should be a string' })
  id: string;
}
