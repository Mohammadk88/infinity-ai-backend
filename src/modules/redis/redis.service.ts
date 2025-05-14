import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    });
    this.client.connect().catch(console.error);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    mode?: string,
    duration?: number,
  ): Promise<void> {
    if (mode && duration) {
      await this.client.set(key, value, { EX: duration });
    } else {
      await this.client.set(key, value);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
