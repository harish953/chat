import { IsString, IsEmail } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
