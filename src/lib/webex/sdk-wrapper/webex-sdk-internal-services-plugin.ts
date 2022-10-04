import {INTERNAL_US_CLUSTER_NAME} from '../../constants';
import type {Webex} from '../../types';

export class WebexSdkInternalServicesPlugin {
  #webex;

  /**
 * Creates a Webex Request wrapper instance for the internal `services` sdk plugin.
 *
 * @param {webex} webex sdk instance
 */
  constructor(webex: Webex) {
    this.#webex = webex;
  }
 
  /**
   * get cluster id from a conversation url
   * 
   * @param {string} ConvoUrl 
   */
  async getClusterId(ConvoUrl: string) {
    const clusterId = await this.#webex.internal.services.getClusterId(ConvoUrl);

    if(clusterId.startsWith(INTERNAL_US_CLUSTER_NAME)) {
      return 'us'
    } else {
      return clusterId.split(':')[0];
    }
  }
}
/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkServicesPlugin}
 */
export const webexSdkInternalServicesPlugin = (webexSdkInstance: Webex) => new WebexSdkInternalServicesPlugin(webexSdkInstance);
