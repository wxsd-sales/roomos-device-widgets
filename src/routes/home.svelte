<script lang="ts">
  import Example from '../components/Example.svelte';
  import { accessTokenSession } from '../lib/store';
  import { webexReqPeopleResource } from '../lib/webex/http-wrapper/webex-http-people-resource';

  let accessToken;
  accessTokenSession.subscribe((value) =>
    webexReqPeopleResource(value?.acess_token)
      .getMyOwnDetails()
      .then((r) => (accessToken = r))
  );
</script>

<div class="container">
  <div class="columns is-centered is-mobile my-1 py-6">
    <div class="column is-four-fifths">
      <div class="box mb-4 pb-4">
        <h1 class="title">Home</h1>
        <div class="card-content">
          <div class="content">You are home!</div>
          <pre><code>{JSON.stringify($accessTokenSession || {}, null, 2)}</code></pre>
          {#if $accessTokenSession}
            <pre><code>{JSON.stringify(accessToken, null, 2)}</code></pre>
          {/if}
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
