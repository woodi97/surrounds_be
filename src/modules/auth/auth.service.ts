import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../user/user.repository';
import type { AuthCredentialDto } from './dto/auth-credential.dto';
import type { SignInAuthDto } from './dto/sign-in-auth-dto';
import type { SignInResultType } from './type/signin-result.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
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
}
