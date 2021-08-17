import { IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsInt({ message: 'Should be a number' })
  id: number;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
