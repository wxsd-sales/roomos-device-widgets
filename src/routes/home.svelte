<script lang="ts">
  import Example from '../components/Example.svelte';
  import { accessTokenSession } from '../lib/store';
</script>

<div class="container">
  <div class="columns is-centered m-1 py-6">
    <div class="column is-four-fifths is-12-mobile">
      <div class="box mb-4 pb-4">
        <h1 class="title">Home</h1>
        <div class="card-content">
          <div class="content">You are home!</div>
          <pre><code>{JSON.stringify($accessTokenSession || {}, null, 2)}</code></pre>
        </div>
      </div>

      <!--{#if import.meta.env.DEV}-->
      <!--  <div class="box my-4">-->
      <!--    <h1 class="title">import.meta.env</h1>-->
      <!--    <div class="card-content">-->
      <!--      <div class="content">-->
      <!--        <pre><code>{JSON.stringify(import.meta.env, null, 2)}</code></pre>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--  </div>-->
      <!--{/if}-->

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
