import type {Webex} from '../../types';

export class WebexSdkMembershipsPlugin {
  #webex;

  /**
   * Creates a Webex Request wrapper instance for the `memberships` sdk plugin.
   *
   * @param {webex} webex sdk instance
   */
  constructor(webex: Webex) {
    this.#webex = webex;
  }

  /**
   * list out membership from given room/person hydra id
   *
   * @param {Webex} webex
   * @param {unknown} options
   */
  list(options = {}) {
    return this.#webex.memberships.list(options);
  }
}

/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkMembershipsPlugin}
 */
export const webexSdkMembershipsPlugin = (webexSdkInstance: Webex) => new WebexSdkMembershipsPlugin(webexSdkInstance);
