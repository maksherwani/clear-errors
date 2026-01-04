import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface ApiKey {
  id: string;
  userId: string;
  key: string;
  name?: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

// In-memory storage (replace with database in production)
const apiKeysStore: Map<string, ApiKey> = new Map();
const keyToIdMap: Map<string, string> = new Map(); // Maps API key to ID

@Injectable()
export class ApiKeysService {
  generateApiKey(): string {
    return `pk_${crypto.randomBytes(32).toString('hex')}`;
  }

  async create(userId: string, name?: string): Promise<ApiKey> {
    const id = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = this.generateApiKey();
    
    const apiKey: ApiKey = {
      id,
      userId,
      key,
      name,
      createdAt: new Date(),
    };

    apiKeysStore.set(id, apiKey);
    keyToIdMap.set(key, id);
    
    return apiKey;
  }

  async list(userId: string): Promise<ApiKey[]> {
    return Array.from(apiKeysStore.values())
      .filter(k => k.userId === userId)
      .map(({ key, ...rest }) => ({
        ...rest,
        key: this.maskKey(key),
      }));
  }

  async findById(id: string, userId: string): Promise<ApiKey | null> {
    const key = apiKeysStore.get(id);
    if (!key || key.userId !== userId) {
      return null;
    }
    return { ...key, key: this.maskKey(key.key) };
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const id = keyToIdMap.get(key);
    if (!id) {
      return null;
    }
    return apiKeysStore.get(id) || null;
  }

  async rotate(id: string, userId: string): Promise<ApiKey> {
    const existing = apiKeysStore.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error('API key not found');
    }

    // Remove old key mapping
    keyToIdMap.delete(existing.key);

    // Generate new key
    const newKey = this.generateApiKey();
    const updated: ApiKey = {
      ...existing,
      key: newKey,
      createdAt: new Date(),
    };

    apiKeysStore.set(id, updated);
    keyToIdMap.set(newKey, id);

    return updated;
  }

  async revoke(id: string, userId: string): Promise<void> {
    const key = apiKeysStore.get(id);
    if (!key || key.userId !== userId) {
      throw new Error('API key not found');
    }

    keyToIdMap.delete(key.key);
    apiKeysStore.delete(id);
  }

  async updateLastUsed(key: string): Promise<void> {
    const id = keyToIdMap.get(key);
    if (id) {
      const apiKey = apiKeysStore.get(id);
      if (apiKey) {
        apiKey.lastUsedAt = new Date();
        apiKeysStore.set(id, apiKey);
      }
    }
  }

  private maskKey(key: string): string {
    // Show first 8 and last 4 characters
    if (key.length <= 12) {
      return key;
    }
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  }
}

