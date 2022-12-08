export class WebexSdkInternalConversationPlugin {
  /**
   * Lists a set of conversations.
   *
   * @param {Webex} webex
   * @param {JSONObject} options
   *
   * @returns {Promise<Conversation[]>}
   */
  list(webex, options) {
    return webex.internal.conversation.list(options);
  }

  /**
   * Downloads the file specified in `item.scr` or `item.url`.
   *
   * @param {Webex} webex
   * @param {Object} item
   * @param {JSONObject} [options]
   *
   * @returns {Promise<File>}
   */
  download(webex, item, options) {
    return webex.internal.conversation.download(item, options);
  }
}

/**
 * Instantiates the Webex SDK internal Conversation Plugin wrapper.
 *
 * @returns {WebexSdkInternalConversationPlugin}
 */
export const webexSdkInternalConversationPlugin = () => new WebexSdkInternalConversationPlugin();
