import type { JSONObject } from '@sveltejs/kit/types/private';

export interface RoomAnalytics {
  ambientNoiseLevelA?: number;
  ambientTemperature?: number;
  airQualityIndex?: number;
  peopleCountCapacity?: number;
  peopleCountCurrent?: number;
  soundLevelA?: number;
  relativeHumidity?: number;
  peoplePresence?: boolean;
  t3AlarmDetected?: boolean;
  engagementCloseProximity?: boolean;
}

export interface Peripheral {
  id: number;
  status: number;
  roomAnalytics?: RoomAnalytics;
  networkAddress?: string;
  softwareInfo?: string;
  hardwareInfo?: string;
  serialNumber?: string;
  type?:
    | 'AudioAmplifier'
    | 'AudioMicrophone'
    | 'Byod'
    | 'Camera'
    | 'ControlSystem'
    | 'InputDevice'
    | 'ISDNLink'
    | 'Other'
    | 'SpeakerTracker'
    | 'TouchPanel'
    | 'Headset'
    | 'RoomScheduler'
    | 'PersistentWebApp';
  name?: string;
  location?: 'OutsideRoom' | 'InsideRoom';
}

export interface Call {
  id: number;
  connectedAt: number;
  callbackNumber: string;
  status:
    | 'Connected'
    | 'Connecting'
    | 'Dialling'
    | 'Disconnecting'
    | 'EarlyMedia'
    | 'Idle'
    | 'OnHold'
    | 'Preserved'
    | 'RemotePreserved'
    | 'Ringing';
  remoteNumber: string;
  displayName: string;
  callType: 'Audio' | 'AudioCanEscalate' | 'ForwardAllCall' | 'Unknown' | 'Video';
  direction: 'Incoming' | 'Outgoing';
  answerState: 'Answered' | 'Autoanswered' | 'Ignored' | 'Unanswered';
  protocol: 'Unknown' | 'H320' | 'H323' | 'SIP' | 'Spark' | 'WebRTC';
  capabilities?: JSONObject;
  bookingId?: string;
}

export interface Status {
  roomAnalytics?: RoomAnalytics;
  peripherals?: Peripheral[];
  calls?: Call[];
}

export enum StateKey {
  EXAMPLE_LOCAL_WRITABLE = 'exampleLocalWritable',
  EXAMPLE_SESSION_WRITABLE = 'exampleSessionWritable',
  EXAMPLE_WRITABLE = 'exampleWritable'
}

export interface TokenResponse {
  id?: string;
  scope: string;
  expiresIn: number;
  expiresAt: number;
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenExpiresAt: number;
}
