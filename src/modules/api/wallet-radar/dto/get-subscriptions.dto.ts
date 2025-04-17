import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetSubscriptionsDto {
  @ApiPropertyOptional({ description: 'Filter by wallet address' })
  @IsString()
  @IsOptional()
  wallet_address?: string;

  @ApiPropertyOptional({ description: 'Filter by blockchain network' })
  @IsString()
  @IsOptional()
  blockchain_network?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  active?: boolean;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  user_id?: number;
}
