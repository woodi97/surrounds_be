import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInKakaoDto {
  @IsNotEmpty({
    message: '카카오 인증 토큰이 정상적으로 전달되지 않았습니다',
  })
  @IsString()
  access_token: string;
}
