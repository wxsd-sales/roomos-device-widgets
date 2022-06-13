<script lang="ts">
  import { onMount } from 'svelte';

  export let locale: string | string[] = undefined;
  export let dateFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  export let timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  let date: Date = new Date();

  onMount(() => {
    const intervalId = setInterval(() => (date = new Date()), (60 - date.getSeconds()) * 100);

    return () => clearInterval(intervalId);
  });
</script>

<div class="level is-mobile mb-0" class:clock-container={true}>
  <div class="level-left" class:clock-date={true}>
    {date.toLocaleDateString(locale, dateFormatOptions)}
  </div>
  <div class="level-right" class:clock-time={true}>
    {date.toLocaleTimeString(locale, timeFormatOptions)}
  </div>
</div>
