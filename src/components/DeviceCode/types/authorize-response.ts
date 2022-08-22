export type AuthorizeResponse = {
  deviceCode: string;
  expiresIn: number;
  expiresAt: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  interval: number;
  qrImage: string;
};
