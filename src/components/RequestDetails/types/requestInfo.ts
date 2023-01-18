import type { SESSION_STATUS } from '../enums/';
import type { MEETING_TYPE_OPTIONS } from '$lib/enums';
import type { Moment } from 'moment';
import type { VISIBILITY_STATUS } from '../enums/visibilityStatus';

export type RequestInfo = {
  sessionStatus: SESSION_STATUS;
  timeStamp: Moment;
  meetingType: MEETING_TYPE_OPTIONS;
  visibilityStatus: VISIBILITY_STATUS;
};
