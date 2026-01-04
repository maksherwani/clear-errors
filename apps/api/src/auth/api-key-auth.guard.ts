import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const apiKey = authHeader.substring(7);
    const keyData = await this.apiKeysService.findByKey(apiKey);

    if (!keyData) {
      return false;
    }

    // Update last used timestamp
    await this.apiKeysService.updateLastUsed(apiKey);

    // Attach user info to request
    request.user = {
      userId: keyData.userId,
      apiKeyId: keyData.id,
    };

    return true;
  }
}

