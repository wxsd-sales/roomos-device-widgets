<script lang="ts">
  import DemoFields from '.Part0DemoFields.svelte';
  import BackgroundFields from '.Part1BackgroundFields.svelte';
  import BrandFields from '.Part2BrandFields.svelte';
  import ButtonsFields from '.Part3ButtonsFields.svelte';
  import GuestInviteFields from '.Part4GuestInviteFields.svelte';
  import NewsFields from '.Part5NewsFields.svelte';
  import WeatherFields from '.Part6WeatherFields.svelte';
  import { onMount } from 'svelte';

  export let form = undefined;
  export let name = undefined;
  export let description = undefined;
  export let poster = undefined;
  export let brightness = undefined;
  export let logo = undefined;
  export let title = undefined;
  export let subtitle = undefined;
  export let destination = undefined;
  export let query = undefined;
  export let cityId = undefined;
  export let units = undefined;

  let formElement: HTMLFormElement;

  onMount(() => form && scrollTo(null, formElement.scrollHeight));
</script>

<form
  id="demo-create"
  class="container px-4 mb-6"
  action="./create"
  method="post"
  enctype="multipart/form-data"
  bind:this={formElement}
>
  <DemoFields {name} {description} />
  <hr />
  <BackgroundFields {poster} {brightness} />
  <hr />
  <BrandFields {logo} {title} {subtitle} />
  <hr />
  <ButtonsFields />
  <hr />
  <GuestInviteFields {destination} />
  <hr />
  <NewsFields {query} />
  <hr />
  <WeatherFields {units} {cityId} />
  <hr />
  <div class="columns is-multiline">
    <div class="column is-12">
      <button class="button is-medium is-rounded is-success is-fullwidth" type="submit">
        <span class="icon">
          <i class="mdi mdi-content-save-plus" />
        </span>
        <span>Save</span>
      </button>
    </div>
    <div class="column is-12 has-text-danger">
      {form ?? ''}
    </div>
  </div>
</form>
