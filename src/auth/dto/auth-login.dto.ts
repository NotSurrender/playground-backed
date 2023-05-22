import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString({ message: 'Password is required' })
  password: string;
}
