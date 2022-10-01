export class WebexSdkPeopleResource {
  #webex;

  constructor(webex) {
    this.#webex = webex;
  }

  getMyOwnDetails() {
    return this.#webex.people.get('me');
  }

  getPersonDetails(id) {
    return this.#webex.people.get(id);
  }
}

/**
 * Instantiates the Webex SDK Messages Plugin wrapper.
 *
 * @returns {WebexSdkPeopleResource}
 */
export const webexSdkPeopleResource = (webexSdkInstance) => new WebexSdkPeopleResource(webexSdkInstance);
