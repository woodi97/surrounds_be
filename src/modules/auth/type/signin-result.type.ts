import type { UserEntity } from '../../user/user.entity';

export type ValidateResultType = Pick<
  UserEntity,
  'email' | 'username' | 'profile_image'
>;

export class SignInResultType implements ValidateResultType {
  access_token: string;

  email: string;

  username: string;

  profile_image: string;
}
