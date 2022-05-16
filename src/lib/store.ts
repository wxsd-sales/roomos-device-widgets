import { localStorage, sessionStorage, storage } from './shared/storage';
import { StateKey, type WebexPerson } from './types';
import type { Json } from './types';
import { WebexHttpPeopleResource } from './webex/http-wrapper/webex-http-people-resource';

export const exampleWritable = storage<string>(StateKey.EXAMPLE_WRITABLE, 'example-writable-value');
export const exampleLocalWritable = localStorage<string>(
  StateKey.EXAMPLE_LOCAL_WRITABLE,
  'initial-local-storage-value'
);
export const exampleSessionWritable = sessionStorage<string>(
  StateKey.EXAMPLE_SESSION_WRITABLE,
  'initial-session-storage-value'
);

export const accessTokenSession = sessionStorage<Json>(StateKey.ACCESS_TOKEN, undefined);

export const contactsListSession = sessionStorage<Array<WebexPerson>>(StateKey.CONTACTS_LIST, []);

export const webexPeopleInstanceMemory = storage<WebexHttpPeopleResource>(StateKey.WEBEX_PEOPLE_INSTANCE, undefined);
