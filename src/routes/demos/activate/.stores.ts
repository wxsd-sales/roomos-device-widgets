import { writable } from 'svelte/store';

export const botToken = writable<string>();
export const botEmail = writable<string>();
export const deviceId = writable<string>();
export const demoUuid = writable<string>();
