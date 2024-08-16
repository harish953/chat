import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  readonly password: string;
}
