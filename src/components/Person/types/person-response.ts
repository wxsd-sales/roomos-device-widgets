export type PersonResponse = {
  avatar?: string;
  created: string;
  displayName?: string;
  emails: string[];
  firstName?: string;
  id: string;
  lastActivity?: string;
  lastModified?: string;
  lastName?: string;
  nickName?: string;
  orgId?: string;
  phoneNumbers?: { type: string; value: string }[];
  status?:
    | 'active'
    | 'call'
    | 'DoNotDisturb'
    | 'inactive'
    | 'meeting'
    | 'OutOfOffice'
    | 'pending'
    | 'presenting'
    | 'unknown';
  type: 'person' | 'bot';
  userName?: string;
};
