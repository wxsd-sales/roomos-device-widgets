<script lang="ts">
  export let status = 500;
  export let error: Error | null = undefined;
</script>

<section class="container is-error-container">
  <div class="columns is-multiline">
    <div class="column is-12">
      <pre class="title is-size-1 has-text-danger">Error: {status}</pre>
    </div>
    <div class="column is-12" class:is-hidden={error?.message == null}>
      <pre class="subtitle">{error?.message}</pre>
    </div>
    <div class="column is-12" class:is-hidden={error?.stack == null}>
      <pre>{error?.stack}</pre>
    </div>
    <slot />
    <div class="column is-12">
      <a class="button is-link is-large is-fullwidth is-rounded" href="/">
        <span class="icon is-large">
          <i class="mdi mdi-arrow-left" />
        </span>
        <span>Home</span>
      </a>
    </div>
  </div>
</section>

<style>
  pre {
    max-width: 90vw;
    border-radius: 0.5rem;
    white-space: pre-wrap;
  }
</style>
