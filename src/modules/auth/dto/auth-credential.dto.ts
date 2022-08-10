import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserVendorStatusEnum } from '../../user/user-vendor-status.enum';

export class AuthCredentialDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'username must be at least 4 characters' })
  @MaxLength(20, { message: 'username must be at most 20 characters' })
  username: string;

  @IsString()
  @IsOptional()
  profile_image: string;

  @IsString()
  @IsOptional()
  auth_vendor: UserVendorStatusEnum;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(20, { message: 'password must be at most 20 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password must contain at least one number, one special character and one uppercase letter',
  })
  password: string;
}
