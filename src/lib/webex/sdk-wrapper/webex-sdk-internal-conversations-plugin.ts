import { encode } from 'js-base64';
import type {Webex} from '../../types';

export class WebexSdkInternalConversationsPlugin {
  #webex;

  /**
   * Creates a Webex Request wrapper instance for the internal `conversation` sdk plugin.
   *
   * @param {Webex} webex sdk instance
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
   * download an encrypted file into buffers.
   *
   * @param file encrypted file
   * @param options options to download the file
   */
  decryptSpaceAvatar(file: unknown, options = { shouldNotAddExifData: true }) {
    try {
      return this.#webex.internal.conversation.download(file, options);
    } catch (error) {
      console.log(error);
    }
  }

/**
 * 
 * @param {string} uuid conversation uuid
 * @param {string} cluster conversation cluster name
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
export const webexSdkInternalConversationsPlugin = (webexSdkInstance: Webex) => new WebexSdkInternalConversationsPlugin(webexSdkInstance);
