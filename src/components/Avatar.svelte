<script lang="ts">
  export let src: string;
  export let type: string;
  export let width: string;
  export let height: string;

  let styles = {
    width: width,
    height: height,
    type: type
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');
</script>

<figure class="image is-128*128" style={cssVarStyles}>
  <img class={`is-rounded avatar ${type}`} {src} alt={src} />
</figure>

<style>
  .avatar {
    width: var(--width);
    height: var(--height);
  }

  .active {
    border: 2px solid green;
  }
</style>
