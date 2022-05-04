import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { StateKey } from '../types';

export function storage<V, S extends keyof WindowSessionStorage | keyof WindowLocalStorage>(
  key: StateKey,
  value?: V,
  browserStorageName?: S
): Writable<V> {
  const store = writable<V>(value);

  if (browser && browserStorageName != null) {
    const browserStorage = window[browserStorageName];
    const browserStorageValue = JSON.parse(browserStorage.getItem(key) || 'null') as V;
    const writableSubscriber = (value: V) =>
      value == null ? browserStorage.removeItem(key) : browserStorage.setItem(key, JSON.stringify(value));
    const storageSubscriber = (ev: StorageEvent) =>
      ev.storageArea === browserStorage && ev.key === key ? store.set(JSON.parse(ev.newValue || 'null') as V) : null;

    if (browserStorageValue == null && value != null) browserStorage.setItem(key, JSON.stringify(value));
    if (browserStorageValue != null) store.set(browserStorageValue);

    store.subscribe(writableSubscriber);
    window.addEventListener('storage', storageSubscriber);
  }

  return store;
}

export function sessionStorage<T>(key: StateKey, initialValue?: T): Writable<T> {
  return storage(key, initialValue, 'sessionStorage');
}

export function localStorage<T>(key: StateKey, initialValue?: T): Writable<T> {
  return storage(key, initialValue, 'localStorage');
}
