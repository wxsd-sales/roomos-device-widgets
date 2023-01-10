export type TokenResponse = {
  id?: string;
  scope: string;
  expiresIn: number;
  expiresAt: string;
  tokenType: string;
  refreshToken: string;
  accessToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenExpiresAt: string;
};
