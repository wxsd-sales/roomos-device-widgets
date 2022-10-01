import { localStorage, sessionStorage, storage } from './shared/storage';
import { StateKey } from './types';

export const exampleWritable = storage<string>(StateKey.EXAMPLE_WRITABLE, 'example-writable-value');
export const exampleSessionWritable = sessionStorage<string>(StateKey.EXAMPLE_SESSION_WRITABLE);
export const exampleLocalWritable = localStorage<string>(StateKey.EXAMPLE_LOCAL_WRITABLE);

export const token = localStorage<string>('token');
