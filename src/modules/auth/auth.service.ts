import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../user/user.repository';
import { UserVendorStatusEnum } from '../user/user-vendor-status.enum';
import type { AuthCredentialDto } from './dto/auth-credential.dto';
import type { KakaoAuthDto } from './dto/kakao-auth.dto';
import type { SignInAuthDto, SignInKakaoDto } from './dto/sign-in-auth.dto';
import { KakaoStrategy } from './strategy/kakao.strategy';
import type { SignInResultType } from './type/signin-result.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly kakaoStrategy: KakaoStrategy,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(signInAuthDto: SignInAuthDto): Promise<SignInResultType> {
    const user = await this.userRepository.validateUserPassword(signInAuthDto);
    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      email: user.email,
      username: user.username,
      profile_image: user.profile_image,
      access_token: accessToken,
    };
  }

  signInKakao(signInKakaoDto: SignInKakaoDto): Promise<SignInResultType> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token } = signInKakaoDto;

    return new Promise((resolve, reject) => {
      this.kakaoStrategy.userProfile(access_token, (error, user) => {
        if (error) {
          return reject(new UnauthorizedException('카카오 로그인 실패'));
        }

        this.kakaoStrategy.validate(
          access_token,
          undefined,
          user,
          async (validateError, payload: KakaoAuthDto) => {
            if (validateError) {
              return reject(new UnauthorizedException('카카오 로그인 실패'));
            }

            // Todo: do we need to get profile_image?
            try {
              await this.userRepository.createUser({
                email: payload.email,
                username: payload.name,
                password: payload.kakaoId + payload.email,
                auth_vendor: UserVendorStatusEnum.KAKAO,
                profile_image: '',
              });
              const accessToken = this.jwtService.sign({
                email: payload.email,
              });

              return resolve({
                email: payload.email,
                username: payload.name,
                profile_image: '',
                access_token: accessToken,
              });
            } catch (error_) {
              if (
                error_.status === 409 &&
                error_.response.message === 'Email already exists'
              ) {
                const accessToken = this.jwtService.sign({
                  email: payload.email,
                });

                return resolve({
                  email: payload.email,
                  username: payload.name,
                  profile_image: '',
                  access_token: accessToken,
                });
              }

              return reject(new UnauthorizedException('카카오 로그인 실패'));
            }
          },
        );
      });
    });
  }
}
