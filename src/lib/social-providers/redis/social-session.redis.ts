import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service'; // Assuming you have a RedisService that handles the connection

@Injectable()
export class SocialSessionStore {
  constructor(private redis: RedisService) {}

  async set(key: string, data: any, ttlSeconds = 300): Promise<void> {
    const jsonData = JSON.stringify(data); // 👈 مهم
    await this.redis.set(key, jsonData, ttlSeconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get<string>(key);
    console.log('Data from Redis:', data);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async delete(key: string): Promise<void> {
    await this.redis.delete(key);
  }
}
