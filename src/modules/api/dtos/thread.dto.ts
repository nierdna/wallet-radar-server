import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateThreadDto {
  @ApiPropertyOptional({
    description: 'The title of the thread',
    example: 'Discussion about blockchain technologies',
    maxLength: 100
  })
  title: string;
}

export class ThreadResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the thread',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'The title of the thread',
    example: 'Discussion about blockchain technologies'
  })
  title: string;

  @ApiProperty({
    description: 'User ID who created the thread',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  user_id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-04-02T10:30:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-04-02T10:30:00Z'
  })
  updated_at: Date;
}

export class StreamMessageDto {
  @ApiProperty({
    description: 'The ID of the thread to stream messages from',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  thread_id: string;

  @ApiProperty({
    description: 'The question or prompt to process',
    example: 'How do blockchain technologies work?'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  question: string;
}

export class ThreadListResponseDto {
  @ApiProperty({
    description: 'Array of threads',
    type: [ThreadResponseDto]
  })
  data: ThreadResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      current_page: 1,
      total_pages: 5,
      take: 10,
      total: 45
    }
  })
  pagination: {
    current_page: number;
    total_pages: number;
    take: number;
    total: number;
  };
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the message',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'The content of the message',
    example: 'How do blockchain technologies work?'
  })
  content: string;

  @ApiProperty({
    description: 'Thread ID the message belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  thread_id: string;

  @ApiProperty({
    description: 'User ID who sent the message',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  user_id: string;

  @ApiProperty({
    description: 'Whether the message is from AI',
    example: false
  })
  is_ai: boolean;

  @ApiProperty({
    description: 'Parent message ID if this is a reply',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  parent_id: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-04-02T10:30:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-04-02T10:30:00Z'
  })
  updated_at: Date;
}

export class MessageListResponseDto {
  @ApiProperty({
    description: 'Array of messages',
    type: [MessageResponseDto]
  })
  data: MessageResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      current_page: 1,
      total_pages: 5,
      take: 10,
      total: 45
    }
  })
  pagination: {
    current_page: number;
    total_pages: number;
    take: number;
    total: number;
  };
} 