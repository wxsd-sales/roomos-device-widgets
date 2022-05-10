import { localStorage, sessionStorage, storage } from './shared/storage';
import { StateKey } from './types';
import type { Json } from './types';

export const exampleWritable = storage<string>(StateKey.EXAMPLE_WRITABLE, 'example-writable-value');
export const exampleLocalWritable = localStorage<string>(
  StateKey.EXAMPLE_LOCAL_WRITABLE,
  'initial-local-storage-value'
);
export const exampleSessionWritable = sessionStorage<string>(
  StateKey.EXAMPLE_SESSION_WRITABLE,
  'initial-session-storage-value'
);

export const credentialsSessionWritable = sessionStorage<Json>(StateKey.CREDENTIALS, undefined);
