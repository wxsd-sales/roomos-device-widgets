/**
 * Constructs a Hydra ID for a given UUID and type.
 *
 * @param {string} type One of PEOPLE, TEAM, ROOM
 * @param {any} id Identifying the "TYPE" object
 * @param {string} cluster Containing the "TYPE" object
 *
 * @returns {string}
 * @export
 */
export function constructHydraId(type, id, cluster = 'us') {
  if (type.toUpperCase() === 'PEOPLE' || type === 'ORGANIZATION') {
    // Cluster is always "us" for people and orgs
    return Buffer.from(`ciscospark://us/${type.toUpperCase()}/${id}`).toString('base64url');
  }

  return Buffer.from(`ciscospark://${cluster}/${type.toUpperCase()}/${id}`).toString('base64url');
}

/**
 * Constructs a Hydra ID for a person based on internal UUID
 *
 * @param {any} uuid
 * @param {string} cluster Containing the person
 *
 * @returns {string}
 * @export
 */
export function buildHydraPersonId(uuid, cluster) {
  return constructHydraId(hydraTypes.PEOPLE, uuid, cluster);
}

/**
 * Constructs a Hydra ID for a room based on internal UUID
 *
 * @param {any} uuid
 * @param {string} cluster Containing the room
 *
 * @returns {string}
 * @export
 */
export function buildHydraRoomId(uuid, cluster) {
  return constructHydraId(hydraTypes.ROOM, uuid, cluster);
}

/**
 * Constructs a Hydra ID for an organization based on internal UUID
 *
 * @param {any} uuid
 * @param {string} cluster Containing the organization
 *
 * @returns {string}
 * @export
 */
export function buildHydraOrgId(uuid, cluster) {
  return constructHydraId('ORGANIZATION', uuid, cluster);
}

/**
 * Constructs a Hydra ID for an membership based on an internal UUID for the person, and the space
 *
 * @param {any} personUUID
 * @param {any} spaceUUID
 * @param {string} cluster Containing the membership
 *
 * @returns {string}
 * @export
 */
export function buildHydraMembershipId(personUUID, spaceUUID, cluster) {
  return constructHydraId(hydraTypes.MEMBERSHIP, `${personUUID}:${spaceUUID}`, cluster);
}

/**
 * Returns a hydra cluster string based on a conversation url
 *
 * @private
 * @memberof Messages
 * @param {Object} webex Sdk instance
 * @param {String} conversationUrl Url of space where activity took place
 *
 * @returns {String} String suitable for UUID -> public ID encoding
 */
export function getHydraClusterString(webex, conversationUrl) {
  const internalClusterString = webex.internal.services.getClusterId(conversationUrl);

  if (
    internalClusterString.startsWith(INTERNAL_US_CLUSTER_NAME) ||
    internalClusterString.startsWith(INTERNAL_US_INTEGRATION_CLUSTER_NAME)
  ) {
    // Original US cluster is simply 'us' for backwards compatibility
    return 'us';
  }
  const clusterParts = internalClusterString.split(':');

  if (clusterParts.length < 3) {
    throw Error(`Unable to determine cluster for convo: ${conversationUrl}`);
  }

  return `${clusterParts[0]}:${clusterParts[1]}:${clusterParts[2]}`;
}

/**
 * Returns a Hydra roomType based on conversation tags
 *
 * @param {arra} tags
 * @param {any} spaceUUID
 *
 * @returns {string}
 * @export
 */
export function getHydraRoomType(tags) {
  if (tags.includes(SDK_EVENT.INTERNAL.ACTIVITY_TAG.ONE_ON_ONE)) {
    return SDK_EVENT.EXTERNAL.SPACE_TYPE.DIRECT;
  }

  return SDK_EVENT.EXTERNAL.SPACE_TYPE.GROUP;
}

/**
 * Returns file URLs for the activity, adhering to Hydra details, e.g., https://api.ciscospark.com/v1/contents/Y2lzY29zcGF...
 *
 * @param {Object} activity From mercury
 * @param {string} cluster Containing the files
 *
 * @returns {Array} File URLs
 * @see https://developer.webex.com/docs/api/v1/messages/get-message-details
 */
export function getHydraFiles(activity, cluster) {
  const hydraFiles = [];
  const { files } = activity.object;

  if (files) {
    const { items } = files;

    // Note: Generated ID is dependent on file order.
    for (let i = 0; i < items.length; i += 1) {
      const contentId = constructHydraId(hydraTypes.CONTENT, `${activity.id}/${i}`, cluster);

      hydraFiles.push(`${hydraBaseUrl}/contents/${contentId}`);
    }
  }

  return hydraFiles;
}

export const hydraBaseUrl = 'https://api.ciscospark.com/v1';

export const SDK_EVENT = {
  INTERNAL: {
    WEBEX_ACTIVITY: 'event:conversation.activity',
    ACTIVITY_FIELD: {
      ACTOR: 'actor',
      OBJECT: 'object',
      TARGET: 'target'
    },
    ACTIVITY_VERB: {
      ACKNOWLEDGE: 'acknowledge',
      CARD_ACTION: 'cardAction',
      CREATE: 'create',
      POST: 'post',
      SHARE: 'share',
      DELETE: 'delete',
      ADD: 'add',
      LEAVE: 'leave',
      ADD_MODERATOR: 'assignModerator',
      REMOVE_MODERATOR: 'unassignModerator',
      LOCK: 'lock',
      UNLOCK: 'unlock',
      HIDE: 'hide',
      UPDATE: 'update'
    },
    ACTIVITY_TAG: {
      HIDDEN: 'HIDDEN',
      ONE_ON_ONE: 'ONE_ON_ONE',
      LOCKED: 'LOCKED'
    }
  },
  EXTERNAL: {
    EVENT_TYPE: {
      CREATED: 'created',
      DELETED: 'deleted',
      UPDATED: 'updated',
      SEEN: 'seen'
    },
    OWNER: {
      CREATOR: 'creator',
      ORG: 'org'
    },
    STATUS: {
      ACTIVE: 'active',
      DISABLED: 'disabled'
    },
    SPACE_TYPE: {
      DIRECT: 'direct',
      GROUP: 'group'
    },
    RESOURCE: {
      ATTACHMENT_ACTIONS: 'attachmentActions',
      MEMBERSHIPS: 'memberships',
      MESSAGES: 'messages',
      ROOMS: 'rooms'
    },
    ATTACHMENTS: {
      CARD_CONTENT_TYPE: 'application/vnd.microsoft.card.adaptive'
    }
  }
};

export const hydraTypes = {
  ATTACHMENT_ACTION: 'ATTACHMENT_ACTION',
  CONTENT: 'CONTENT',
  MEMBERSHIP: 'MEMBERSHIP',
  MESSAGE: 'MESSAGE',
  ORGANIZATION: 'ORGANIZATION',
  PEOPLE: 'PEOPLE',
  ROOM: 'ROOM',
  TEAM: 'TEAM'
};

export const deviceType = {
  PROVISIONAL: 'PROVISIONAL',
  WEB: 'WEB'
};

export const INTERNAL_US_CLUSTER_NAME = 'urn:TEAM:us-east-2_a';
export const INTERNAL_US_INTEGRATION_CLUSTER_NAME = 'urn:TEAM:us-east-1_int13';
