import { Module } from '@nestjs/common';
import { TranslateController } from './translate/translate.controller';
import { TranslateService } from './translate/translate.service';
import { RulesController } from './rules/rules.controller';
import { RulesService } from './rules/rules.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UsageService } from './usage/usage.service';
import { UsageController } from './usage/usage.controller';
import { ApiKeysController } from './api-keys/api-keys.controller';
import { ApiKeysService } from './api-keys/api-keys.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [AuthModule],
  controllers: [
    TranslateController,
    RulesController,
    AuthController,
    UsageController,
    ApiKeysController,
    SubscriptionController,
  ],
  providers: [
    TranslateService,
    RulesService,
    UsageService,
    ApiKeysService,
    SubscriptionService,
  ],
  exports: [ApiKeysService, SubscriptionService, UsageService],
})
export class AppModule {}

