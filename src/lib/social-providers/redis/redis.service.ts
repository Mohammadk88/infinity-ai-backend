import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;
  private isConnecting = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || '',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
      },
    }) as RedisClientType;

    // Setup event listeners
    this.client.on('error', (err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Redis error: ${error.message}`, error.stack);
    });
    this.client.on('connect', () =>
      this.logger.log('Redis connected successfully'),
    );
    this.client.on('reconnecting', () =>
      this.logger.log('Redis reconnecting...'),
    );
    this.client.on('end', () => this.logger.log('Redis connection closed'));
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  /**
   * Connect to Redis server
   */
  private async connect(): Promise<void> {
    if (!this.client.isReady && !this.isConnecting) {
      this.isConnecting = true;
      try {
        await this.client.connect();
        this.logger.log('Redis connection established');
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.error(
          `Failed to connect to Redis: ${err.message}`,
          err.stack,
        );
      } finally {
        this.isConnecting = false;
      }
    }
  }

  /**
   * Gracefully disconnect from Redis server
   */
  private async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
        this.logger.log('Redis connection closed gracefully');
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.logger.error(
          `Error closing Redis connection: ${err.message}`,
          err.stack,
        );
        // Force disconnect if graceful shutdown fails
        void this.client.disconnect();
      }
    }
  }

  /**
   * Ensure Redis connection is established
   */
  private async ensureConnection(): Promise<void> {
    if (!this.client.isReady) {
      await this.connect();
    }
  }

  /**
   * Set a value with expiration time
   * @param key The key to set
   * @param value The value to store (will be JSON stringified)
   * @param ttlSeconds Time to live in seconds
   */
  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    try {
      await this.ensureConnection();
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error setting Redis key '${key}': ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Get a value by key
   * @param key The key to retrieve
   * @returns The parsed value or null if not found
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      await this.ensureConnection();
      const data = await this.client.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error getting Redis key '${key}': ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Delete a key
   * @param key The key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      await this.ensureConnection();
      await this.client.del(key);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error deleting Redis key '${key}': ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Check if a key exists
   * @param key The key to check
   * @returns True if key exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      await this.ensureConnection();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error checking Redis key '${key}': ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Get the TTL of a key in seconds
   * @param key The key to check
   * @returns TTL in seconds, -2 if key doesn't exist, -1 if key has no expiry
   */
  async getTtl(key: string): Promise<number> {
    try {
      await this.ensureConnection();
      return await this.client.ttl(key);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error getting TTL for Redis key '${key}': ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Delete multiple keys
   * @param keys Array of keys to delete
   * @returns Number of keys deleted
   */
  async deleteMany(keys: string[]): Promise<number> {
    try {
      if (keys.length === 0) return 0;
      await this.ensureConnection();
      return await this.client.del(keys);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Error deleting multiple Redis keys: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}
