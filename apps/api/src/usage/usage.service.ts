import { Injectable } from '@nestjs/common';

// In-memory storage (replace with database in production)
const usageStore: Map<string, { count: number; resetAt: Date }> = new Map();
const subscriptionStore: Map<string, 'free' | 'pro' | 'team'> = new Map();

// Free tier: 20 translations/day
const FREE_TIER_LIMIT = 20;
const PRO_TIER_LIMIT = Infinity; // Unlimited
const TEAM_TIER_LIMIT = Infinity; // Unlimited

@Injectable()
export class UsageService {
  setUserTier(userId: string, tier: 'free' | 'pro' | 'team'): void {
    subscriptionStore.set(userId, tier);
  }

  private getUserTier(userId: string): 'free' | 'pro' | 'team' {
    return subscriptionStore.get(userId) || 'free';
  }

  async checkUsage(userId: string): Promise<boolean> {
    const usage = usageStore.get(userId);
    const now = new Date();

    // Reset if past the day
    if (!usage || usage.resetAt < now) {
      usageStore.set(userId, { count: 0, resetAt: this.getNextResetTime() });
      return true;
    }

    // Check subscription tier
    const tier = this.getUserTier(userId);
    const limit = this.getLimitForPlan(tier);

    return usage.count < limit;
  }

  async logUsage(userId: string): Promise<void> {
    const usage = usageStore.get(userId) || { count: 0, resetAt: this.getNextResetTime() };
    const now = new Date();

    // Reset if past the day
    if (usage.resetAt < now) {
      usage.count = 0;
      usage.resetAt = this.getNextResetTime();
    }

    usage.count++;
    usageStore.set(userId, usage);
  }

  async getUsage(userId: string): Promise<{ count: number; limit: number }> {
    const usage = usageStore.get(userId) || { count: 0, resetAt: this.getNextResetTime() };
    const tier = this.getUserTier(userId);
    const limit = this.getLimitForPlan(tier);

    return { count: usage.count, limit };
  }

  private getLimitForPlan(plan: 'free' | 'pro' | 'team'): number {
    switch (plan) {
      case 'pro':
      case 'team':
        return PRO_TIER_LIMIT;
      default:
        return FREE_TIER_LIMIT;
    }
  }

  private getNextResetTime(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
}

