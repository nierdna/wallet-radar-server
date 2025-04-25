import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestRabbitMQEventDto {
  @ApiProperty({
    description: 'Wallet address',
    example: '0xEb6b7b2D2881154e48d2BE82689a5F23318AEb2b',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  wallet_address: string;

  @ApiProperty({
    description: 'Token address',
    example: '0xDd33fEeD5D44D9e89b69C8E9397292E0D6554a66',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  token_address: string;

  @ApiProperty({ description: 'Blockchain network', example: 'base' })
  @IsString()
  @IsNotEmpty()
  blockchain_network: string;

  @ApiProperty({
    description: 'Transaction hash',
    example:
      '0x2afc0f21e172a7077c49fb250971834190a2dd05ae70f17d563def35360da28f',
  })
  @IsString()
  @IsNotEmpty()
  transaction_hash: string;

  @ApiProperty({ description: 'Amount', example: '0' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'From address',
    example: '0x32a001d721Fa3826E5A92AF6D029beb44D2ede16',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    description: 'To address',
    example: '0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    description: 'Timestamp (ISO 8601)',
    example: '2025-04-25T17:14:25.648Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({ description: 'Block number', example: 29045127 })
  @IsNumber()
  block_number: number;
}
