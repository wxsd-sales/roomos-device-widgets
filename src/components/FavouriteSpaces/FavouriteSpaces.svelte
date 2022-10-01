<script lang="ts">
  import { onMount } from 'svelte';
  import {
    webexSdk,
    webexSdkRoomsResource,
    webexSdkMembershipsResource,
    webexSdkPeopleResource
  } from '../../lib/webex/sdk-wrapper';
  import { webexHttpRoomsResource } from '../../lib/webex/http-wrapper';
  import { RoomTags, type RoomResponse } from '../../lib/types';
  import FavouriteSpace from './FavouriteSpace.svelte';
  import type { FaveSpace } from './types/faveSpace';

  let accessToken =
    'ZDdkYWY4YjgtNWY3My00MWRjLWEwMjktMzQzM2ZlOTUxYmIzZTcwNzRhOTctZWM4_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f';
  // export let accessToken: string;

  let FAVES: Array<FaveSpace> = [];

  onMount(async () => {
    const webexSdkInstance = await webexSdk(accessToken).initialize();
    const webexSdkMembershipsResourceInstance = webexSdkMembershipsResource(webexSdkInstance);
    const webexSdkRoomsResourceInstace = webexSdkRoomsResource(webexSdkInstance);
    const webexSdkPeopleResourceInstance = webexSdkPeopleResource(webexSdkInstance);
    const webexHttpRoomsResourceInstace = webexHttpRoomsResource(accessToken);

    const spaces = await webexSdkRoomsResourceInstace.list();
    const faves = spaces.filter((space: RoomResponse) => space.tags.includes(RoomTags.FAVORITE));
    const directFaves = faves.filter((fave: RoomResponse) => fave.tags.includes(RoomTags.ONE_ON_ONE));
    const groupFaves = faves.filter((fave: RoomResponse) => !fave.tags.includes(RoomTags.ONE_ON_ONE));

    directFaves.forEach(async (directSpace: RoomResponse) => {
      const { items } = await webexSdkMembershipsResourceInstance.list({
        roomId: webexSdkRoomsResourceInstace.buildHydraId(directSpace.id)
      });

      const { id } = await webexSdkPeopleResourceInstance.getMyOwnDetails();
      items.map(async ({ personId }) => {
        if (personId !== id) {
          const { avatar, displayName, emails } = await webexSdkPeopleResourceInstance.getPersonDetails(personId);
          FAVES = [{ avatar, title: displayName, sipAddress: emails[0] }, ...FAVES];
        }
      });
    });

    groupFaves.forEach(async (groupSpace: RoomResponse) => {
      const { sipAddress } = await webexHttpRoomsResourceInstace.getRoomMeetingInfo(
        webexSdkRoomsResourceInstace.buildHydraId(groupSpace.id)
      );
      const file = groupSpace?.avatar?.files?.items[0];
      const buffer = file ? await webexSdkRoomsResourceInstace.decryptSpaceAvatar(file) : undefined;

      FAVES = [
        {
          avatar: file ? `data:${file.mimeType};base64,${Buffer.from(buffer).toString('base64')}` : undefined,
          title: groupSpace.displayName,
          sipAddress
        },
        ...FAVES
      ];
    });
  });
</script>

<div class="columns is-multiline is-vcentered is-centered favourite-contacts-container">
  <div class:loader-on={!FAVES.length} />
  {#each FAVES as { title, avatar, sipAddress }}
    <FavouriteSpace {title} {avatar} {sipAddress} />
  {/each}
</div>
