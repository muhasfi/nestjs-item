import { IsOptional, IsString } from 'class-validator';

export class QueryItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  category: string;
}
