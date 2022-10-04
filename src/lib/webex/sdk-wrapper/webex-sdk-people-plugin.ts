import type {Webex} from '../../types';

export class WebexSdkPeoplePlugin {
  #webex;

  /**
   * Creates a Webex Request wrapper instance for the `people` sdk plugin.
   *
   * @param {webex} webex sdk instance
   */
  constructor(webex: Webex) {
    this.#webex = webex;
  }

  /**
   * pull current user information
   *
   */
  getMyOwnDetails() {
    return this.#webex.people.get('me');
  }

  /**
   * pull any webex user details from a given hydra id
   *
   * @param {string} person id
   */
  getPersonDetails(id: string) {
    return this.#webex.people.get(id);
  }
}

/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkPeoplePlugin}
 */
export const webexSdkPeoplePlugin = (webexSdkInstance: Webex) => new WebexSdkPeoplePlugin(webexSdkInstance);
