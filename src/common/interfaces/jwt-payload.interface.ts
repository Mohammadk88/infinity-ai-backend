export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  clientId: string; // ✅ أضف هذا
  // أضف أي شيء تاني بتحطه بالتوكن
}
