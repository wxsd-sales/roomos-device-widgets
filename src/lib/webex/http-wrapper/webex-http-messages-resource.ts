import { WebexHttp } from './webex-http';
import type { JSONObject } from '@sveltejs/kit/types/private';

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
   * @returns {Promise<JSONObject[]>}
   */
  listDirectMessages(query: { parentId?: string; personId: string } | { parentId?: string; personEmail: string }) {
    return this.get('direct', query)
      .then((r) => r.json())
      .then((r: { items: JSONObject[] }) => r.items);
  }

  /**
   * Lists all messages in a room.
   *
   * @param query
   *
   * @returns {Promise<JSONObject[]>}
   */
  listMessages(query: {
    roomId: string;
    parentId?: string;
    mentionedPeople?: string[];
    before?: string;
    beforeMessage?: string;
    max?: number;
  }) {
    return this.get(undefined, query)
      .then((r) => r.json())
      .then((r: { items: JSONObject[] }) => r.items);
  }

  /**
   * Send a plain text message to a room.
   *
   * @param body
   *
   * @returns {Promise<JSONObject>}
   */
  createMessage(body: { roomId: string; text: string } | { roomId: string; markdown: string }) {
    return this.post(undefined, undefined, body).then((r) => r.json() as Promise<JSONObject>);
  }
}

/**
 * Instantiates the Webex request wrapper for the `messages` HTTP API resource.
 *
 * @param accessToken
 *
 * @returns {WebexHttpMessagesResource}
 */
export const webexHttpMessagesResource = (accessToken: string) => new WebexHttpMessagesResource(accessToken);
