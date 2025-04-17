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

@ApiTags('wallet-radar')
@Controller('wallet-radar')
export class WalletRadarController {
  constructor(private readonly walletRadarService: WalletRadarService) {}

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
