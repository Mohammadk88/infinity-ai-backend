import { createHash, randomBytes } from 'crypto';

export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(codeVerifier: string): string {
  const hashed = createHash('sha256').update(codeVerifier).digest();
  return hashed.toString('base64url');
}
