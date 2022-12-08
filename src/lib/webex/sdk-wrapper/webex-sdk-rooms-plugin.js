import { getHydraRoomType, getHydraClusterString, buildHydraRoomId, buildHydraPersonId } from './webex-sdk-common.js';
export class WebexSdkRoomsPlugin {
  /**
   * Starts listening for message events by establishing a websocket connection.
   *
   * @param {Webex} webex
   * @param {Conversation[]} conversation
   *
   * @returns {Promise<Room[]>}
   */
  buildRoomInfo(webex, conversation) {
    try {
      const type = getHydraRoomType(conversation.tags);
      const cluster = getHydraClusterString(webex, conversation.url);
      const title = conversation.displayName ? conversation.displayName : conversation.computedTitle;
      const lastActivityDate = conversation.lastReadableActivityDate
        ? conversation.lastReadableActivityDate
        : conversation.lastRelevantActivityDate;

      const roomInfo = {
        id: buildHydraRoomId(conversation.id, cluster),
        creatorUuid: conversation?.creatorUUID,
        creatorId: buildHydraPersonId(conversation.creatorUUID, 'us'),
        type,
        ...(title && { title: conversation.displayName }),
        ...(lastActivityDate && { lastActivityDate }),
        lastSeenActivityDate: conversation.lastSeenActivityDate
          ? conversation.lastSeenActivityDate
          : // If user has never been seen set the date to "a long time ago"
            new Date(0).toISOString()
      };

      return Promise.resolve(roomInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  buildRoomInfoList(webex, conversations) {
    // Convert each Conversation into a roomInfo object
    const roomReadInfo = { items: [] };
    const roomInfoPromises = [];

    for (const conversation of conversations) {
      roomInfoPromises.push(this.buildRoomInfo(webex, conversation));
    }

    return Promise.all(roomInfoPromises).then((roomInfoList) => {
      roomReadInfo.items = roomInfoList;
      roomReadInfo.items.sort((a, b) => (a.lastActivityDate < b.lastActivityDate ? 1 : -1));

      return roomReadInfo;
    });
  }
}

/**
 * Instantiates the Webex SDK Rooms Plugin wrapper.
 *
 * @returns {WebexSdkRoomsPlugin}
 */
export const webexSdkRoomsPlugin = () => new WebexSdkRoomsPlugin();
