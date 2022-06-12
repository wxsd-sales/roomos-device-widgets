import { WEBEX_SDK_CONFIG } from '../../constants';
import { WebexSdkErrorPrefix } from '../../types';

export class WebexSdk {
  #accessToken;
  #config;

  /**
   * Creates a Webex SDK wrapper instance.
   *
   * @param {string} accessToken
   * @param {Record<string, unknown>} config
   */
  constructor(accessToken, config = WEBEX_SDK_CONFIG) {
    this.#accessToken = accessToken;
    this.#config = config;
  }

  /**
   * Initialize the core Webex instance from the SDK.
   *
   * @returns {Promise<Webex | string>}
   */
  initialize() {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-undef
      const webex = new Webex({ config: this.#config, credentials: { access_token: this.#accessToken } });
      resolve(webex);
    }).catch((e) => `${WebexSdkErrorPrefix.INITIALIZATION}: ${e}.`);
  }
}

/**
 * Instantiates the Webex SDK wrapper.
 *
 * @param {string} accessToken
 * @param {Record<string, unknown>} config
 *
 * @returns {WebexSdk}
 */
export const webexSdk = (accessToken, config = WEBEX_SDK_CONFIG) => new WebexSdk(accessToken, config);
