export class WebexSdkMembershipsPlugin {
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
      return this.#webex.memberships.list(options);
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkMembershipsPlugin}
 */
export const webexSdkMembershipsResource = (webexSdkInstance) => new WebexSdkMembershipsPlugin(webexSdkInstance);
