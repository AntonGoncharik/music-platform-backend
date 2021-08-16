import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Should be string' })
  id: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
