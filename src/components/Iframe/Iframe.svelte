<script lang="ts">
  export let url = undefined;
  export let ratio = 'is-5by4';
</script>

<figure class="image {ratio}">
  <iframe src={url} class="has-ratio" />
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
