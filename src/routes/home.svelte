<script lang="ts">
  import Example from '../components/Example.svelte';
  import { webexOauthSessionWritable } from '../lib/store';
  import { onMount } from 'svelte';
  import { webexHttpPeopleResource } from '../lib/webex/http-wrapper/webex-http-people-resource';

  let webexUser = {};

  onMount(async () => {
    webexUser = $webexOauthSessionWritable
      ? await webexHttpPeopleResource($webexOauthSessionWritable.access_token).getMyOwnDetails({ callingData: true })
      : {};
  });
</script>

<div class="container">
  <div class="columns is-centered m-1 py-6">
    <div class="column is-four-fifths is-12-mobile">
      <div class="box mb-4 pb-4">
        <h1 class="title">Home</h1>
        <div class="card-content">
          <div class="content">
            <h2 class="subtitle">You are home!</h2>
            <h2 class="subtitle">Webex Oauth</h2>
            <pre><code>{JSON.stringify($webexOauthSessionWritable || {}, null, 2)}</code></pre>
            <h2 class="subtitle">Authorized Webex User</h2>
            <pre><code>{JSON.stringify(webexUser || {}, null, 2)}</code></pre>
          </div>
        </div>
      </div>

      {#if import.meta.env.DEV}
        <div class="box my-4">
          <h1 class="title">import.meta.env</h1>
          <div class="card-content">
            <div class="content">
              <pre><code>{JSON.stringify(import.meta.env, null, 2)}</code></pre>
            </div>
          </div>
        </div>
      {/if}

      <div class="box my-4">
        <h1 class="title">Svelte Component</h1>
        <div class="card-content">
          <div class="content">
            <Example />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
