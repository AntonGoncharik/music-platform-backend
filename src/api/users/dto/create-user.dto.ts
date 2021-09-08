import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty()
  email: string;

  @IsString({ message: 'Should be a string' })
  @Length(4, 16, { message: 'Not less than 4 and not more than 16 characters' })
  @ApiProperty()
  password: string;
}
