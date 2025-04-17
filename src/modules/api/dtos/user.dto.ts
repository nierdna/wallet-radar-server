import { User } from '@/database/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class UserParamsDto {
  @ApiProperty({
    description: 'Ethereum address of the user',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Ethereum address of the user',
    example: '0x1234567890123456789012345678901234567890',
  })
  address: string;

  @ApiProperty({
    description: 'Whether the user is a family member',
    example: false,
  })
  is_family: boolean;

  @ApiProperty({
    description: 'Total amount staked by the user',
    example: 1.5,
  })
  stake_amount: number;

  @ApiProperty({
    description: 'Total amount unstaked by the user',
    example: 0.5,
  })
  unstake_amount: number;

  @ApiProperty({
    description: 'Total amount of rewards claimed by the user',
    example: 0.1,
  })
  claimed_reward_amount: number;

  @ApiProperty({
    description: 'Total amount of rewards earned by the user',
    example: 0.2,
  })
  total_reward_amount: number;

  @ApiProperty({
    description: 'Current reward nonce of the user',
    example: 1,
  })
  reward_nonce: number;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2023-01-02T00:00:00.000Z',
  })
  updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export class APYResponseDto {
  @ApiProperty({
    description: 'Current APY value',
    example: '10.5',
  })
  apy: string;
} 