<script context="module" lang="ts">
  import type { Load, LoadEvent } from '@sveltejs/kit';

  export const load: Load = (loadEvent: LoadEvent) => {
    const { params, props, routeId, session, stuff, url, status, error } = loadEvent;

    return {
      props: {
        params: params,
        props: import.meta.env.DEV ? props : null,
        routeId: import.meta.env.DEV ? routeId : null,
        session: session,
        stuff: import.meta.env.DEV ? stuff : null,
        url: url,
        status: status,
        error: import.meta.env.DEV ? error : null
      }
    };
  };
</script>

<script lang="ts">
  import ErrorComponent from '../components/Error/Error.svelte';

  export let params = undefined;
  export let props = undefined;
  export let routeId = undefined;
  export let session = undefined;
  export let stuff = undefined;
  export let url = undefined;
  export let status = undefined;
  export let error = undefined;
</script>

<ErrorComponent {status} {error} backLink="/auth" backText="Home">
  {#if import.meta.env.DEV}
    <div class="column is-12">
      <details open>
        <summary>params</summary>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </details>
    </div>
    <div class="column is-12">
      <details open>
        <summary>props</summary>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </details>
    </div>
    <div class="column is-12">
      <details open>
        <summary>routeId</summary>
        <pre>{JSON.stringify(routeId, null, 2)}</pre>
      </details>
    </div>
    <div class="column is-12">
      <details open>
        <summary>session</summary>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </details>
    </div>
    <div class="column is-12">
      <details open>
        <summary>stuff</summary>
        <pre>{JSON.stringify(stuff, null, 2)}</pre>
      </details>
    </div>
    <div class="column is-12">
      <details open>
        <summary>url</summary>
        <pre>{JSON.stringify(url, null, 2)}</pre>
      </details>
    </div>
  {/if}
</ErrorComponent>

<style>
  pre {
    max-height: 400px;
    border-radius: var(--border-radius);
  }
  details > summary {
    cursor: pointer;
  }
  details {
    border: 1px solid hsl(0deg, 0%, 86%);
    border-radius: var(--border-radius);
    padding: 0.75rem;
  }
</style>
