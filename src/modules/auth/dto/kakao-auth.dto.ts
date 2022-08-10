import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class KakaoAuthDto {
  @IsNotEmpty()
  @IsString()
  kakaoId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
