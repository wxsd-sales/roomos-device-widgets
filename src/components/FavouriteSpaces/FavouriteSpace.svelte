<script lang="ts">
  import { readable } from 'svelte/store';
  import Avatar from '../Avatar/Avatar.svelte';
  import Meet from '../Meet/Meet.svelte';

  export let id: string;
  export let sipAddress: string | undefined = undefined;
  export let avatar: string | undefined;
  export let title: string | undefined;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let removeContact: (...args) => Promise<Response> = () => Promise.reject(undefined);
</script>

<div class="column is-12">
  <section class="container">
    <div class="column is-vcentered is-mobile">
      <div class="columns is-narrow">
        <Avatar initials={title?.charAt(0)} image={avatar} />
        <div class="column is-flex is-align-items-center p-0 pl-4 pb-4">
          <h2 class="has-text-weight-bold">
            <span class="is-size-5 person-nickname">{title}</span>
          </h2>
        </div>
        <div class="column is-3">
          <Meet {id} destination={sipAddress} {disconnect} {connect} {callsStore} />
        </div>
      </div>
    </div>
  </section>
</div>
