import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RulesService } from './rules/rules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ErrorRule } from '@ahmedsherwani/clearerrors-core';

@Controller('rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  async getRules(@Request() req: any): Promise<ErrorRule[]> {
    return this.rulesService.getUserRules(req.user.userId);
  }

  @Post()
  async createRule(@Request() req: any, @Body() rule: ErrorRule): Promise<ErrorRule> {
    return this.rulesService.createRule(req.user.userId, rule);
  }

  @Delete(':id')
  async deleteRule(@Request() req: any, @Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.rulesService.deleteRule(req.user.userId, id);
    return { success };
  }
}

