import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class ApiKeyOrJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private apiKeysService: ApiKeysService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);

    // Try API key first
    if (token.startsWith('pk_')) {
      const keyData = await this.apiKeysService.findByKey(token);
      if (keyData) {
        await this.apiKeysService.updateLastUsed(token);
        request.user = {
          userId: keyData.userId,
          apiKeyId: keyData.id,
        };
        return true;
      }
    }

    // Fall back to JWT
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch {
      return false;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    return user || null;
  }
}

