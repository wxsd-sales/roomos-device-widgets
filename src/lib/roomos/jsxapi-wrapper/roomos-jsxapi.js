import { RoomosJsxapiErrorPrefix } from '../../types';

export class RoomosJsxapi {
  #config;

  /**
   * Creates a RoomOS JSXAPI wrapper instance.
   *
   * @param {Record<string, unknown>} [config]
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Initialize the core RoomOS JSXAPI instance.
   *
   * @return {Promise<XAPI | string>}
   */
  async initialize() {
    try {
      // eslint-disable-next-line no-undef
      return Promise.resolve(await getXAPI());
    } catch (e) {
      return Promise.reject(`${RoomosJsxapiErrorPrefix.INITIALIZATION}: ${e}.`);
    }
  }
}

/**
 * Instantiates the Webex SDK wrapper.
 *
 * @param {Record<string, unknown>} [config]
 *
 * @return {RoomosJsxapi}
 */
export const roomosJsxapi = (config) => new RoomosJsxapi(config);
