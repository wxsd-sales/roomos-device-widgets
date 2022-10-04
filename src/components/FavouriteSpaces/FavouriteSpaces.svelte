<script lang="ts">
  import { onMount } from 'svelte';
  import {
    webexSdkInternalConversationsPlugin,
    webexSdkMembershipsPlugin,
    webexSdkPeoplePlugin,
    webexSdkInternalServicesPlugin
  } from '$lib/webex/sdk-wrapper';
  import { readable } from 'svelte/store';
  import { webexHttpRoomsResource } from '../../lib/webex/http-wrapper';
  import { RoomTags, type ConvoResponse } from '../../lib/types';
  import FavouriteSpace from './FavouriteSpace.svelte';
  import type { FaveSpace } from './types/faveSpace';
  import type { Webex } from '../../lib/types';

  export let webexSdkInstance: Webex;
  export let accessToken: string;
  export let callsStore = readable([]);
  export let disconnect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let connect: (...args) => Promise<Response> = () => Promise.reject(undefined);
  export let removeContact: (...args) => Promise<Response> = () => Promise.reject(undefined);

  let FAVES: Array<FaveSpace> = [];
  let displayEmptyMessage = false;

  const webexSdkMembershipsPluginInstance = webexSdkMembershipsPlugin(webexSdkInstance);
  const webexSdkInternalConversationsPluginInstance = webexSdkInternalConversationsPlugin(webexSdkInstance);
  const webexSdkPeoplePluginInstance = webexSdkPeoplePlugin(webexSdkInstance);
  const webexSdkInternalServicesPluginInstance = webexSdkInternalServicesPlugin(webexSdkInstance);

  const webexHttpRoomsResourceInstace = webexHttpRoomsResource(accessToken);

  export const directFavesResponse = (directFaves: Array<ConvoResponse>): Promise<Array<FaveSpace>> =>
    Promise.all(
      directFaves.map(async (directSpace: ConvoResponse) => {
        const cluster = await webexSdkInternalServicesPluginInstance.getClusterId(directSpace.url);
        const hydraId = webexSdkInternalConversationsPluginInstance.buildHydraId(directSpace.id, cluster);
        const { id } = await webexSdkPeoplePluginInstance.getMyOwnDetails();
        const { items } = await webexSdkMembershipsPluginInstance.list({ roomId: hydraId });
        const [{ personId }] = items.filter(({ personId }: { personId: string }) => personId !== id);
        const { avatar, displayName, emails } = await webexSdkPeoplePluginInstance.getPersonDetails(personId);

        return { id: hydraId, avatar, title: displayName, sipAddress: emails[0] };
      })
    );

  export const groupFavesResponse = (groupFaves: Array<ConvoResponse>): Promise<Array<FaveSpace>> =>
    Promise.all(
      groupFaves.map(async (groupFave: ConvoResponse) => {
        const cluster = await webexSdkInternalServicesPluginInstance.getClusterId(groupFave.url);
        const hydraId = webexSdkInternalConversationsPluginInstance.buildHydraId(groupFave.id, cluster);
        const { sipAddress } = await webexHttpRoomsResourceInstace.getRoomMeetingInfo(hydraId);
        const file = groupFave?.avatar?.files?.items[0];
        const buffer = file ? await webexSdkInternalConversationsPluginInstance.decryptSpaceAvatar(file) : undefined;

        return {
          id: hydraId,
          avatar: file ? `data:${file.mimeType};base64,${Buffer.from(buffer).toString('base64')}` : undefined,
          title: groupFave.displayName,
          sipAddress
        };
      })
    );

  onMount(async () => {
    try {
      const spaces = await webexSdkInternalConversationsPluginInstance.list();
      const faves = spaces.filter((space: ConvoResponse) => space.tags.includes(RoomTags.FAVORITE));
      const directFaves = faves.filter((fave: ConvoResponse) => fave.tags.includes(RoomTags.ONE_ON_ONE));
      const groupFaves = faves.filter((fave: ConvoResponse) => !fave.tags.includes(RoomTags.ONE_ON_ONE));

      FAVES = [...(await directFavesResponse(directFaves)), ...(await groupFavesResponse(groupFaves))];

      if (!FAVES.length) displayEmptyMessage = true;
    } catch (e) {
      console.log(e);
    }
  });
</script>

<div class="columns is-multiline is-vcentered is-centered favourite-contacts-container">
  <div class:loader-on={!FAVES.length} />
  {#each FAVES as { id, title, avatar, sipAddress }}
    <FavouriteSpace {id} {title} {avatar} {sipAddress} {callsStore} {disconnect} {connect} />
  {/each}
  {#if displayEmptyMessage}
    <div class="column is-12 favourite-contacts-error">
      <p class="subtitle has-text-danger">Could not get favourite contacts.</p>
    </div>
  {/if}
</div>
