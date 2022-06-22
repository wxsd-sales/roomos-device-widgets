<script lang="ts">
  export let text;
</script>

<div class="columns is-vcentered is-mobile" class:title-row={true}>
  <div class="column" class:title-column={true}>
    <h2 class="title is-size-4 has-text-left" class:title-text={true}>
      {text}
    </h2>
  </div>
  <slot />
</div>
