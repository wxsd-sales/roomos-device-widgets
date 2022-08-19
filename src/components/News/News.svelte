<script lang="ts">
  import { jsonRequest } from '$lib/shared/json-request';
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import Title from '../Title/Title.svelte';

  export let title = 'Top News Stories';
  export let dataSource = 'Google News';
  export let query: string = undefined;
  export let updateInterval = 1800;
  export let rtf = new Intl.RelativeTimeFormat('en', { style: 'narrow' });

  const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (2 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
  };

  export const getRelativeTime = (d1, d2 = new Date()) => {
    const elapsed = d1 - d2;

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (const u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second') return rtf.format(Math.round(elapsed / units[u]), u);
  };

  export const getNewsResponse = () =>
    jsonRequest('/api')
      .get('news', query != null ? { q: query } : undefined)
      .then((r) => r.text())
      .then((r) => new DOMParser().parseFromString(r, 'application/xml'))
      .then((r) =>
        [...r.querySelectorAll('channel>item').values()].map((r) => ({
          title: r.getElementsByTagName('title')?.[0].innerHTML,
          pubDate: r.getElementsByTagName('pubDate')?.[0].innerHTML,
          link: r.getElementsByTagName('link')?.[0].innerHTML,
          source: {
            name: r.getElementsByTagName('source')?.[0].innerHTML,
            link: r.getElementsByTagName('source')?.[0].getAttribute('url')
          }
        }))
      );

  let newsResponse = browser ? getNewsResponse() : Promise.resolve(undefined);

  onMount(() => {
    const intervalId = setInterval(() => (newsResponse = getNewsResponse()), updateInterval * 1000);

    return () => clearInterval(intervalId);
  });
</script>

{#if title != null}
  <Title text={title}>
    {#if dataSource}
      <div class="column is-narrow" class:title-column={true}>
        <p class="is-size-7 has-text-right has-text-grey-light" class:title-data-source={true}>
          Source: {dataSource}
        </p>
      </div>
    {/if}
  </Title>
{/if}

<div class="columns is-multiline" class:news-container={true}>
  {#await newsResponse}
    <div class="column is-12">
      <progress class="progress is-small is-link" max="100">0%</progress>
    </div>
  {:then news}
    <div class="column">
      {#each news as newsItem}
        <div class="level mb-2">
          <p class="is-size-5 has-text-weight-medium is-clipped">
            {@html newsItem.title.substring(0, newsItem.title.lastIndexOf('-'))}
          </p>
        </div>
        <div class="level is-mobile has-text-weight-medium has-text-grey-light">
          <div class="level-left">
            <figure class="level-item image is-16x16">
              <img
                class="is-rounded"
                src="https://www.google.com/s2/favicons?sz=16&domain_url={newsItem.source.link}"
                alt={newsItem.source.name}
              />
            </figure>
            <p class="icon-text level-item is-size-6">
              {newsItem.source.name}<span class="is-hidden-mobile">, {newsItem.source.link}</span>
            </p>
          </div>

          <p class="level-right icon-text  is-size-6 mt-0">{getRelativeTime(new Date(newsItem.pubDate))}</p>
        </div>
      {/each}
      {#if news.length === 0}
        <p class="subtitle">No news on topic.</p>
      {/if}
    </div>
  {:catch error}
    <div class="column is-12">
      <p class="subtitle has-text-danger" title={error?.message}>Could not get news items.</p>
    </div>
  {/await}
</div>
