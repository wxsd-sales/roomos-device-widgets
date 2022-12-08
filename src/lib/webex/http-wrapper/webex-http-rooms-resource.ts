import { WebexHttp } from './webex-http';
export class WebexHttpRoomsResource extends WebexHttp {
  /**
   * Creates a Webex Request wrapper instance for the `rooms` HTTP API resource.
   *
   * @param accessToken
   */
  constructor(accessToken: string) {
    super('rooms', accessToken);
  }

  /**
   * Get details for a room, by their Webex HTTP API identifier.
   *
   * @param roomId
   *
   * @returns {Promise<Json | string>}
   */
  getRoomDetails(roomId: string) {
    return this.get(roomId);
  }

  /**
   * Get meeting details for a room, by their Webex HTTP API identifier.
   *
   * @param roomId
   *
   * @returns {Promise<Json | string>}
   */
  getRoomMeetingDetails(roomId: string) {
    return this.get(`${roomId}/meetingInfo`);
  }
}

/**
 * Instantiates the Webex request wrapper for the `rooms` HTTP API resource.
 *
 * @param accessToken
 *
 * @returns {webexHttpRoomsResource}
 */
export const webexHttpRoomsResource = (accessToken: string) => new WebexHttpRoomsResource(accessToken);
