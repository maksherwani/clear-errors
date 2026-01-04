import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsageService } from '../usage/usage.service';

export interface Subscription {
  plan: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'past_due';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}

// In-memory storage (replace with database in production)
const subscriptionsStore: Map<string, Subscription> = new Map();

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(forwardRef(() => UsageService))
    private usageService: UsageService,
  ) {}

  async get(userId: string): Promise<Subscription> {
    const sub = subscriptionsStore.get(userId);
    if (!sub) {
      // Default to free plan
      return {
        plan: 'free',
        status: 'active',
      };
    }
    return sub;
  }

  async set(userId: string, subscription: Subscription): Promise<void> {
    subscriptionsStore.set(userId, subscription);
    // Update usage service with new tier
    this.usageService.setUserTier(userId, subscription.plan);
  }

  async createCheckoutSession(userId: string, plan: 'pro' | 'team'): Promise<{ url: string }> {
    // In production, integrate with Stripe
    // For now, return a mock URL
    const mockUrl = `/checkout?plan=${plan}&userId=${userId}`;
    
    // In production, you would:
    // 1. Create Stripe Checkout Session
    // 2. Store session ID
    // 3. Return checkout URL
    
    return { url: mockUrl };
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    // In production, integrate with Stripe Customer Portal
    // For now, return a mock URL
    const mockUrl = `/billing-portal?userId=${userId}`;
    
    // In production, you would:
    // 1. Get Stripe Customer ID
    // 2. Create portal session
    // 3. Return portal URL
    
    return { url: mockUrl };
  }
}

