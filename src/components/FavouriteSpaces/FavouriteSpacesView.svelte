<script lang="ts">
  import { readable } from 'svelte/store';
  import Person from '../Person/Person.svelte';
  import Meet from '../Meet/Meet.svelte';
  import Space from '../Space/Space.svelte';

  export let direct = [];
  export let group = [];
  export let accessToken;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);
</script>

<div class="columns is-multiline is-vcentered is-centered">
  {#each direct as direct (direct.id)}
    {#if direct.type.toLowerCase() === 'person'}
      <div class="column is-12">
        <Person id={direct.id} {accessToken} size={48} let:email>
          <Meet id={direct.id} destination={email} {disconnect} {connect} {callsStore} />
        </Person>
      </div>
    {:else}
      <div class="column is-12">
        <Space id={direct.id} avatar={direct.avatar} size={48} sipAddress={direct.sipAddress} title={direct.title}>
          <Meet id={direct.id} destination={direct.sipAddress} {disconnect} {connect} {callsStore} />
        </Space>
      </div>
    {/if}
  {/each}
  {#each group as group (group.id)}
    <div class="column is-12">
      <Space id={group.id} avatar={group.avatar} size={48} sipAddress={group.sipAddress} title={group.title}>
        {#if group.sipAddress != null}
          <Meet id={group.id} destination={group.sipAddress} {disconnect} {connect} {callsStore} />
        {/if}
      </Space>
    </div>
  {/each}
  {#if direct.length + group.length === 0}
    <div class="column is-12 has-text-centered">
      <p class="subtitle">You don't have any favourite spaces.</p>
    </div>
  {/if}
</div>
