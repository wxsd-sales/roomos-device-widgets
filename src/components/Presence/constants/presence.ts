import { STATUS } from './status';

export const PRESENCE = {
  [STATUS.ACTIVE]: { icon: 'checkbox-blank-circle', color: 'success' },
  [STATUS.CALL]: { icon: 'phone', color: 'warning' },
  [STATUS.DND]: { icon: 'minus-circle', color: 'danger' },
  [STATUS.INACTIVE]: { icon: 'clock', color: 'grey-light' },
  [STATUS.MEETING]: { icon: 'video', color: 'warning' },
  [STATUS.OOO]: { icon: 'airplane', color: 'grey-light' },
  [STATUS.PENDING]: { icon: 'account-clock', color: 'grey-light' },
  [STATUS.PRESENTING]: { icon: 'presentation', color: 'danger' },
  [STATUS.UNKNOWN]: { icon: '', color: '' }
};
