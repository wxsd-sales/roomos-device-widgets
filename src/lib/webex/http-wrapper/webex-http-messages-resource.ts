import { WebexHttp } from './webex-http';
import type { Json } from '../../types';

export class WebexHttpMessagesResource extends WebexHttp {
  /**
   * Creates a Webex Request wrapper instance for the `messages` HTTP API resource.
   *
   * @param accessToken
   */
  constructor(accessToken: string) {
    super('messages', accessToken);
  }

  /**
   * Lists all messages in a 1:1 (direct) room.
   *
   * @param query
   *
   * @return {Promise<Json[]> | string}
   */
  listDirectMessages(query: { parentId?: string; personId: string } | { parentId?: string; personEmail: string }) {
    return this.get('direct', query).then((r: { items: Json[] }) => r.items);
  }

  /**
   * Lists all messages in a room.
   *
   * @param query
   *
   * @return {Promise<Json[]> | string}
   */
  listMessages(query: {
    roomId: string;
    parentId?: string;
    mentionedPeople?: string[];
    before?: string;
    beforeMessage?: string;
    max?: number;
  }) {
    return this.get(undefined, query).then((r: { items: Json[] }) => r.items);
  }
}

/**
 * Instantiates the Webex request wrapper for the `messages` HTTP API resource.
 *
 * @param accessToken
 *
 * @return {WebexHttpMessagesResource}
 */
export const webexReqMessagesResource = (accessToken: string) => new WebexHttpMessagesResource(accessToken);
