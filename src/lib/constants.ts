export const WEBEX_GETTING_STARTED_LINK =
  'https://developer.webex.com/docs/getting-started#accounts-and-authentication';

export const WEBEX_API_ENDPOINT = 'https://webexapis.com/v1';

export const WEBEX_SDK_CONFIG = {
  logger: { level: 'silent' },
  meetings: { reconnection: { enabled: true } }
};

export enum MEETING_TYPE_OPTIONS  {
  BROWSER_SDK = 'SDK',
  INSTANT_CONNECT = 'IC',
  SIP_URI_DIALING = 'SIP'
};

export const AUDIO_OUTPUT = 'audiooutput';
export const AUDIO_SOURCE = 'audioinput';
export const VIDEO_SOURCE = 'videoinput';

export const AUDIO_OUTPUT_PREFIX = 'Speaker';
export const AUDIO_SOURCE_PREFIX = 'Microphone';
export const VIDEO_SOURCE_PREFIX = 'Camera';

export const MUTE_AUDIO = 'Mute Audio';
export const UNMUTE_AUDIO = 'Unmute Audio';

export const MUTE_VIDEO = 'Stop Video';
export const UNMUTE_VIDEO = 'Start Video';

export const MUTE_SHARE = 'Stop Share';
export const UNMUTE_SHARE = 'Start Share';

export const SDK_MEETING_TYPE = 'SDK';
export const IC_MEETING_TYPE = 'IC';
export const SIP_MEETING_TYPE = 'SIP';

export const VALID_UUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
export const VALID_ACCESS_TOKEN =
  /^([a-zA-Z0-9]{64})_(.*)_([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/;
export const APP_PATTERN = /^https?:\/\/(?:teams|teams-stage|teams-unstable|teams-test).webex.com/;
export const VALID_PHONE =
  /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
export const VALID_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const VALID_SIP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\w|-)+\.)*(webex|ciscospark|projectsquared).com$/;
export const VALID_PMR_ADDRESS = /([a-z0-9][-a-z0-9, '.']{0,62})@([a-z0-9][-a-z0-9, '.']{0,62})\.webex\.com/i;
export const VALID_PMR_LINK =
  /(https:\/\/)?([a-z0-9][-a-z0-9, '.']{0,62})\.webex\.com\/(meet|join)\/([a-z0-9][-a-z0-9, '.']{0,62})\/?/i;
export const VALID_MEETING_LINK =
  /(https:\/\/)?([a-z0-9][-a-z0-9, '.']{0,62})\.(?:webex|ciscospark)\.com\/(?:meet|join|m)\/([a-z0-9][-a-z0-9, '.']{0,62})\/?/i;
export const VALID_PIN = /([0-9]{4,6})/;
export const VALID_LOCI = /loci\/([\w-]+)/;
export const VALID_SHORT_SIP = /\d{9,11}@webex\.com/i;
export const VALID_SIP_MEETING_NUMBER = /(\d{9,11})@(?:\w+\.)?webex\.com/i;

export const VALID_DESTINATION = new RegExp(
  `(${VALID_MEETING_LINK.source})|(${VALID_PMR_LINK.source})|(${VALID_PMR_ADDRESS.source})|(${VALID_SIP.source})|(${VALID_EMAIL.source})`,
  'i'
);
