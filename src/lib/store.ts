import { localStorage } from './shared/storage';
import { StateKey } from './types';
import type { TokenResponse } from './types';


export const tokenResponseStore = localStorage<TokenResponse>(StateKey.WEBEX_TOKEN);
