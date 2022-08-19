export interface TokenResponse {
  id?: string;
  scope: string;
  expiresIn: number;
  expiresAt: number;
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenExpiresAt: number;
}
