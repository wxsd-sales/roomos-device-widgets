import type { TokenResponse } from '$lib/types';

export const isTokenValid = (token: TokenResponse) => {
  if (!token) throw Error('token does not exist');

  if(new Date(token.expiresAt) < new Date()) {
    return false;
  }

  return true;
}