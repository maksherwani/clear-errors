import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateApiKeyDto {
  name?: string;
}

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async list(@Request() req: any) {
    return this.apiKeysService.list(req.user.userId);
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    const apiKey = await this.apiKeysService.create(req.user.userId, dto.name);
    // Return full key only on creation
    return apiKey;
  }

  @Post(':id/rotate')
  async rotate(@Request() req: any, @Param('id') id: string) {
    const apiKey = await this.apiKeysService.rotate(id, req.user.userId);
    // Return full key only on rotation
    return apiKey;
  }

  @Delete(':id')
  async revoke(@Request() req: any, @Param('id') id: string) {
    await this.apiKeysService.revoke(id, req.user.userId);
    return { success: true };
  }
}

