/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface Locals {
    session?: import('./database/entities/session').Session;
  }
  // interface Platform {}
  interface Session {
    email?: string;
  }
  // interface Stuff {}
}
