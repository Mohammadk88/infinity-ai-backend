export interface JwtPayload {
  id: string;
  sub: string;
  email?: string;
  role?: string;
  clientId: string; // ✅ أضف هذا
  teamId: string;
  // أضف أي شيء تاني بتحطه بالتوكن
}
