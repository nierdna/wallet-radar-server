import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletRadarService } from './wallet-radar.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetSubscriptionsDto } from './dto/get-subscriptions.dto';
import { NotificationService } from '../../business/wallet-radar/services/notification.service';

@ApiTags('wallet-radar')
@Controller('wallet-radar')
export class WalletRadarController {
  constructor(
    private readonly walletRadarService: WalletRadarService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Create a new wallet monitoring subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return this.walletRadarService.createSubscription(dto);
  }

  @Get('test-webhook')
  @ApiOperation({ summary: 'Test webhook with mock data' })
  @ApiResponse({ status: 200, description: 'Returns mock webhook data' })
  async testWebhook() {
    return {
      wallet_address: '0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397',
      token_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      blockchain_network: 'base',
      transaction_hash:
        '0x2afc0f21e172a7077c49fb250971834190a2dd05ae70f17d563def35360da28f',
      amount: '0',
      from: '0x32a001d721Fa3826E5A92AF6D029beb44D2ede16',
      to: '0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397',
      timestamp: '2025-04-17T08:46:41.000Z',
      block_number: 29045127,
    };
  }

  @Get('test-rabbitmq')
  @ApiOperation({ summary: 'Test RabbitMQ event with mock data' })
  @ApiResponse({ status: 200, description: 'Mock event sent to RabbitMQ' })
  async testRabbitMQ() {
    const mockData = {
      wallet_address: '0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397',
      token_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      blockchain_network: 'base',
      transaction_hash:
        '0x2afc0f21e172a7077c49fb250971834190a2dd05ae70f17d563def35360da28f',
      amount: '0',
      from: '0x32a001d721Fa3826E5A92AF6D029beb44D2ede16',
      to: '0xb16C8828E41651cCD3131B10AF7E0bCF1c48E397',
      timestamp: new Date().toISOString(),
      block_number: 29045127,
    };

    try {
      await this.notificationService.sendRabbitMQEvent(mockData);
      return {
        success: true,
        message: 'Test event sent to RabbitMQ successfully',
        data: mockData,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send test event: ${error.message}`,
        data: mockData,
      };
    }
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Get all wallet monitoring subscriptions' })
  @ApiResponse({ status: 200, description: 'Returns all subscriptions' })
  async getSubscriptions(@Query() query: GetSubscriptionsDto) {
    return this.walletRadarService.getSubscriptions(query);
  }

  @Get('subscriptions/:id')
  @ApiOperation({ summary: 'Get a wallet monitoring subscription by ID' })
  @ApiResponse({ status: 200, description: 'Returns the subscription' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async getSubscriptionById(@Param('id', ParseIntPipe) id: number) {
    return this.walletRadarService.getSubscriptionById(id);
  }

  @Delete('subscriptions/:id')
  @ApiOperation({ summary: 'Delete a wallet monitoring subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async deleteSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.walletRadarService.deleteSubscription(id);
  }
}
