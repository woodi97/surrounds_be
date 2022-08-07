import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetChatroomDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number(value.value))
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number(value.value))
  longitude: number;

  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  radius: number;
}
