<script lang="ts">
  import DemoFields from './.Part0DemoFields.svelte';
  import BackgroundFields from './.Part1BackgroundFields.svelte';
  import BrandFields from './.Part2BrandFields.svelte';
  import MeetingTypesOptionsFields from './.Part3MeetingTypesOptionsFields.svelte';
  import AuthenticationRequirement from './.Part4AuthenticationRequirementFields.svelte';
  import WeatherFields from './.Part5WeatherFields.svelte';

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { urlEncodedRequest } from '../../../lib/shared/urlencoded-request';
  import { MEETING_TYPE_OPTIONS } from '$lib/enums';

  export let form = undefined;
  export let name = undefined;
  export let description = undefined;
  export let poster = undefined;
  export let brightness = undefined;
  export let logo = undefined;
  export let title = undefined;
  export let subtitle = undefined;
  export let cityId = undefined;
  export let meetingTypeOptions: Array<MEETING_TYPE_OPTIONS>;
  export let isSDK = meetingTypeOptions ? meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.BROWSER_SDK) : false;
  export let isIC = meetingTypeOptions ? meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.INSTANT_CONNECT) : false;
  export let isSIP = meetingTypeOptions ? meetingTypeOptions.includes(MEETING_TYPE_OPTIONS.SIP_URI_DIALING) : false;
  export let responderAuthIsRequired = undefined;
  export let units = undefined;

  let showAuthWarningModal = false;
  let showSIPWarningModal = false;

  const id = $page.url.searchParams.get('id');

  let formElement: HTMLFormElement;

  const toFileList = (file?: { bits: string; name: string; lastModified: number; type: string }) =>
    file != null
      ? urlEncodedRequest(file.bits)
          .get()
          .then((r) => r.blob())
          .then((r) => new File([r], file.name, { lastModified: file.lastModified, type: file.type }))
          .then((r) => {
            const container = new DataTransfer();
            container.items.add(r);
            return container.files;
          })
      : Promise.reject();

  onMount(() => form && scrollTo(null, formElement.scrollHeight));
</script>

<form
  id="demo-create"
  class="container px-4 mb-6"
  action={'./save' + (id == null ? '' : '?_method=PATCH')}
  method="post"
  enctype="multipart/form-data"
  bind:this={formElement}
>
  <DemoFields {name} {description} />
  <hr />
  {#await toFileList(poster) then poster}
    <BackgroundFields {poster} {brightness} />
  {:catch e}
    <BackgroundFields {brightness} />
  {/await}
  <hr />
  {#await toFileList(logo) then logo}
    <BrandFields {logo} {title} {subtitle} />
  {:catch e}
    <BrandFields {title} {subtitle} />
  {/await}
  <hr />
  <MeetingTypesOptionsFields
    {isSDK}
    {isIC}
    {isSIP}
    {showSIPWarningModal}
    on:showAuthWarningModal={(event) => {
      showAuthWarningModal = event.detail.checkSIPBox;
      if (showAuthWarningModal) showSIPWarningModal = false;
    }}
  />
  <!-- <hr />
   <AuthenticationRequirement
    {responderAuthIsRequired}
    {showAuthWarningModal}
    on:showSIPWarningModal={(event) => {
      showSIPWarningModal = event.detail.authCheckBox;
      if (showSIPWarningModal) showAuthWarningModal = false;
    }}
  /> -->
  <hr />
  <WeatherFields {units} {cityId} />
  <hr />

  <div class="columns is-multiline">
    {#if id != null}
      <div class="column is-12 is-hidden">
        <input class="input" name="id" value={id} readonly />
      </div>
    {/if}
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
