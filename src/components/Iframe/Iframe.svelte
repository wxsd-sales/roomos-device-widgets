<script lang="ts">
  export let url = undefined;
  export let ratio = 'is-5by4';
  export let allow: string;
</script>

<figure class="image {ratio}">
  <iframe title="iframe" src={url} class="has-ratio" {allow} />
</figure>

<style>
  figure {
    height: 100%;
    width: 100%;
  }
  figure > iframe {
    border-radius: var(--border-radius-large);
  }
</style>
