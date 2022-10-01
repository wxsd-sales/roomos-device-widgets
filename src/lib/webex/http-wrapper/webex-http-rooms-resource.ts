import { WebexHttp } from './webex-http';

export class WebexHttpRoomsResource extends WebexHttp {
  /**
   * Creates a Webex Request wrapper instance for the `messages` HTTP API resource.
   *
   * @param accessToken
   */
  constructor(accessToken: string) {
    super('rooms', accessToken);
  }

  getRoomMeetingInfo(id: string) {
    return this.get(`${id}/meetingInfo`).then((r) => r.json());
  }
}

export const webexHttpRoomsResource = (accessToken: string) => new WebexHttpRoomsResource(accessToken);
