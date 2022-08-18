<script lang="ts">
  export let units = undefined;
  export let icon = undefined;
  export let value: number | string;
  export let name;
</script>

<div
  class="is-flex is-flex-direction-column is-justify-content-space-between is-flex-grow-1 has-text-weight-medium"
  class:room-analytics-card-container={true}
>
  <p
    class="is-size-7-mobile is-size-6-tablet has-text-weight-medium has-text-grey-light has-text-left mb-5"
    class:room-analytics-card-name={true}
  >
    {name}
  </p>

  <div class="level is-size-5" class:room-analytics-card-value={true}>
    <div class="level-left has-text-grey-light">
      <span class="icon is-medium">
        <i class="mdi mdi-{icon} mdi-36px" />
      </span>
    </div>
    <div class="level-right">
      {value ?? 'N/A'}
      {value != null && units != null ? units : ''}
    </div>
  </div>
</div>
