import { localStorage, sessionStorage, storage } from './shared/storage';
import { ContactsStatusMode, StateKey } from './types';
import type { Json } from './types';
import type { WebexHttpPeopleResource } from './webex/http-wrapper/webex-http-people-resource';
import type { Writable } from 'svelte/store';

export const exampleWritable = storage<string>(StateKey.EXAMPLE_WRITABLE, 'example-writable-value');
export const exampleLocalWritable = localStorage<string>(
  StateKey.EXAMPLE_LOCAL_WRITABLE,
  'initial-local-storage-value'
);
export const exampleSessionWritable = sessionStorage<string>(
  StateKey.EXAMPLE_SESSION_WRITABLE,
  'initial-session-storage-value'
);

export const webexOauthSessionWritable = sessionStorage<Json>(StateKey.WEBEX_OAUTH, undefined);

export const webexPeopleInstanceMemory = storage<WebexHttpPeopleResource>(StateKey.WEBEX_PEOPLE_INSTANCE, undefined);

export const deviceSerial: Writable<string> = localStorage(StateKey.DEVICE_SERIAL);

export const activeCall: Writable<{ status?: string; uuid?: string }> = storage(StateKey.ACTIVE_CALL, {});

export const contactsStatusMode: Writable<ContactsStatusMode> = storage(
  StateKey.CONTACTS_STATUS_MODE,
  ContactsStatusMode.POLLING
);
