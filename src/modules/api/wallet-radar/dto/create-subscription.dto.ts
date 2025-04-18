import {
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Ethereum address of the wallet to monitor' })
  @IsEthereumAddress()
  @IsNotEmpty()
  wallet_address: string;

  @ApiPropertyOptional({
    description:
      'Ethereum address of the token to monitor (null for all tokens)',
  })
  @IsEthereumAddress()
  @IsOptional()
  token_address?: string;

  @ApiProperty({
    description: 'Blockchain network to monitor (e.g., "base", "ethereum")',
  })
  @IsString()
  @IsNotEmpty()
  blockchain_network: string;

  @ApiPropertyOptional({
    description: 'Webhook URL to receive transaction alerts',
  })
  @IsString()
  @IsOptional()
  webhook_url?: string;

  @ApiPropertyOptional({ description: 'Email to receive transaction alerts' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Block number to start monitoring from',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  last_processed_block?: number;
}
