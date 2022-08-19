<script lang="ts">
  import { STATUS } from './constants/status';
  import { PRESENCE } from './constants/presence';

  export let status: STATUS = STATUS.UNKNOWN;

  $: icon = PRESENCE[status].icon;
  $: color = PRESENCE[status].color;

  let size;
</script>

<span class="icon has-background-dark presence" bind:clientWidth={size} title={status}>
  <i class="mdi mdi-{icon} has-text-{color}" style="font-size: {(size || 8) - 4}px" />
</span>

<style>
  .presence > i {
    padding-top: 6%;
  }
</style>
