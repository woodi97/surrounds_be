import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

import { ApiConfigService } from '../../../shared/services/api-config.service';
import type { KakaoAuthDto } from '../dto/kakao-auth.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ApiConfigService) {
    super({
      clientID: configService.socialLoginConfig.kakao.clientId,
      callbackURL: configService.socialLoginConfig.kakao.callbackUrl,
    });
  }

  validate(accessToken: string, refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakaoAccount = profileJson.kakao_account;
    const payload: KakaoAuthDto = {
      name: kakaoAccount.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakaoAccount.email && !kakaoAccount.email_needs_agreement
          ? kakaoAccount.email
          : undefined,
    };
    done(undefined, payload);
  }
}
