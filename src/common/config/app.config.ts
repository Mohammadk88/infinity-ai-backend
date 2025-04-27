import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfig {
  private baseUrl: string;

  constructor() {
    // Get the base URL from environment variables or use a default
    this.baseUrl =
      process.env.BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api.infinity-ai.app'
        : `http://localhost:${process.env.PORT || 4040}`);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getFullUrl(path: string): string {
    // If the path already starts with http or https, return it as is
    if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
      return path;
    }

    // If path is null or undefined, return empty string
    if (!path) {
      return '';
    }

    // Remove leading slash if present in the path
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Combine base URL and path
    return `${this.baseUrl}/${cleanPath}`;
  }
}
