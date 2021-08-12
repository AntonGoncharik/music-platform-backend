import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Not less than 4 and not more than 16 characters' })
  password: string;
}
