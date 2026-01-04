import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CheckoutDto {
  plan: 'pro' | 'team';
}

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async get(@Request() req: any) {
    const sub = await this.subscriptionService.get(req.user.userId);
    return {
      ...sub,
      currentPeriodEnd: sub.currentPeriodEnd?.toISOString(),
    };
  }

  @Post('checkout')
  async createCheckoutSession(@Request() req: any, @Body() dto: CheckoutDto) {
    return this.subscriptionService.createCheckoutSession(req.user.userId, dto.plan);
  }

  @Post('portal')
  async createPortalSession(@Request() req: any) {
    return this.subscriptionService.createPortalSession(req.user.userId);
  }
}

