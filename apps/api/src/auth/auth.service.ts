import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// In-memory user store (replace with database in production)
interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const usersStore: Map<string, User> = new Map();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = Array.from(usersStore.values()).find(u => u.email === email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { userId: user.id, email: user.email };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.userId, email: user.email },
    };
  }

  async register(email: string, password: string) {
    // Check if user exists
    const existing = Array.from(usersStore.values()).find(u => u.email === email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    // Create user
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    usersStore.set(userId, {
      id: userId,
      email,
      passwordHash,
    });

    return this.login({ userId, email });
  }

  async validateJwtPayload(payload: any) {
    const user = usersStore.get(payload.sub);
    if (!user) {
      return null;
    }
    return { userId: user.id, email: user.email };
  }
}

