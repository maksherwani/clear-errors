import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsageService } from './usage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usage')
@UseGuards(JwtAuthGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  async get(@Request() req: any) {
    return this.usageService.getUsage(req.user.userId);
  }
}

