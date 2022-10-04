import { WEBEX_SDK_CONFIG } from '../../constants';
import { WebexSdkErrorPrefix } from '../../types';
import type {Webex} from '../../types';

export class WebexSdk {
  #accessToken;
  #config;

  /**
   * Creates a Webex SDK wrapper instance.
   *
   * @param {string} accessToken
   * @param {Record<string, unknown>} config
   */
  constructor(accessToken: string, config = WEBEX_SDK_CONFIG) {
    this.#accessToken = accessToken;
    this.#config = config;
  }

  /**
   * Initialize the core Webex instance from the SDK.
   *
   * @returns {Promise<Webex>}
   */
  initialize(): Promise<Webex> {
    return new Promise((resolve) => {
      resolve(new Webex({ config: this.#config, credentials: { access_token: this.#accessToken } }));
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
export const webexSdk = (accessToken: string, config = WEBEX_SDK_CONFIG) => new WebexSdk(accessToken, config);
