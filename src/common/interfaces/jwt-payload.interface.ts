export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  // أضف أي شيء تاني بتحطه بالتوكن
}
