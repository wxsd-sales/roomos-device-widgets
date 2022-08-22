export type TokenResponse = {
  scope: string;
  expiresIn: number;
  expiresAt: string;
  tokenType: string;
  refreshToken: string;
  accessToken: string;
  refreshTokenExpiresIn: string;
  refreshTokenExpiresAt: string;
};
