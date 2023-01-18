import { Base64 } from 'js-base64';

export const getUserUUID = (hydraID: string) => {
  const buffers = Base64.decode(hydraID).split('/');

  return buffers[buffers.length - 1];
};
