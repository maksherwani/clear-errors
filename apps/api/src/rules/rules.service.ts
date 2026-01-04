import { Injectable } from '@nestjs/common';
import { ErrorRule } from '@ahmedsherwani/clearerrors-core';

// In-memory storage (replace with database in production)
const rulesStore: Map<string, ErrorRule[]> = new Map();

@Injectable()
export class RulesService {
  async getUserRules(userId: string): Promise<ErrorRule[]> {
    return rulesStore.get(userId) || [];
  }

  async createRule(userId: string, rule: ErrorRule): Promise<ErrorRule> {
    const userRules = rulesStore.get(userId) || [];
    const newRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    userRules.push(newRule);
    rulesStore.set(userId, userRules);
    return newRule;
  }

  async deleteRule(userId: string, ruleId: string): Promise<boolean> {
    const userRules = rulesStore.get(userId) || [];
    const filtered = userRules.filter(r => r.id !== ruleId);
    rulesStore.set(userId, filtered);
    return filtered.length < userRules.length;
  }
}

