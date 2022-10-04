import { encode } from 'js-base64';
import type { Webex } from '../../types';

export class WebexSdkInternalConversationsPlugin {
  #webex;

  /**
   * Creates a Webex Request wrapper instance for the internal `conversation` sdk plugin.
   *
   * @param {Webex} webex Sdk instance
   */
  constructor(webex: Webex) {
    this.#webex = webex;
  }

  /**
   * List out all conversation objects in an array.
   *
   * @param {Webex} webex
   */
  async list() {
    return this.#webex.internal.conversation.list();
  }

  /**
   * Download an encrypted file into buffers.
   *
   * @param file Encrypted file
   * @param options Options to download the file
   */
  decryptSpaceAvatar(file: unknown, options = { shouldNotAddExifData: true }) {
    try {
      return this.#webex.internal.conversation.download(file, options);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param {string} uuid Conversation uuid
   * @param {string} cluster Conversation cluster name
   *
   * @returns
   */
  buildHydraId(uuid: string, cluster = 'us') {
    return encode(`ciscospark://${cluster}/ROOM/${uuid}`);
  }
}

/**
 * Instantiates the Webex SDK internal conversation Plugin wrapper.
 *
 * @returns {WebexSdkInternalConversationsPlugin}
 */
export const webexSdkInternalConversationsPlugin = (webexSdkInstance: Webex) =>
  new WebexSdkInternalConversationsPlugin(webexSdkInstance);
