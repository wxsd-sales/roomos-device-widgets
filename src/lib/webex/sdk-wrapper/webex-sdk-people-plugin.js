export class WebexSdkPeoplePlugin {
  /**
   * Lists a set of conversations.
   *
   * @param {Webex} webex
   * @param {Object} user
   * @param {JSONObject} options
   *
   * @returns {Promise<Conversation[]>}
   */
  get(webex, user) {
    return webex.people.get(user);
  }
}

/**
 * Instantiates the Webex SDK internal Conversation Plugin wrapper.
 *
 * @returns {WebexSdkPeoplePlugin}
 */
export const webexSdkPeoplePlugin = () => new WebexSdkPeoplePlugin();
