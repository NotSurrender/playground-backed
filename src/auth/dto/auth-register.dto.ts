import { IsEmail, IsString } from 'class-validator';

export class AuthRegisterDto {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Password is required' })
  password: string;
}
