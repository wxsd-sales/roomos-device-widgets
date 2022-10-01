import { encode } from 'js-base64';

export class WebexSdkRoomsPlugin {
  #webex;

  constructor(webex) {
    this.#webex = webex;
  }
  /**
   * Starts listening for message events by establishing a websocket connection.
   *
   * @param {Webex} webex
   * @param {unknown} options
   */
  list(options = {}) {
    try {
      return this.#webex.internal.conversation.list(options);
    } catch (error) {
      console.log(error);
    }
  }

  decryptSpaceAvatar(file, options = { shouldNotAddExifData: true }) {
    try {
      return this.#webex.internal.conversation.download(file, options);
    } catch (error) {
      console.log(error);
    }
  }

  buildHydraId(uuid) {
    return encode(`ciscospark://us/ROOM/${uuid}`);
  }

  getRoom(id) {
    let hydraID = id;

    if (id.includes('ciscospark')) {
      hydraID = this.buildHydraId(id);
    }

    return this.#webex.rooms.get(id);
  }
}

/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkRoomsPlugin}
 */
export const webexSdkRoomsResource = (webexSdkInstance) => new WebexSdkRoomsPlugin(webexSdkInstance);
