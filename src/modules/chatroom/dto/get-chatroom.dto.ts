import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetChatroomDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius: number;
}
