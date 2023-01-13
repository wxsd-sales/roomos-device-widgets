import { SOAP_BOX_URL } from '$lib/constants';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { MEMBERS_UPDATE, APPEND, REMOVE, HSET, CONNECT, INIT_LIST } from '../constants';

interface SOCKET_PAYLOAD_DATA {
  event: string;
  status ?: string;
  sessionStatus ?: string;
  meetingType ?: string;
  payload: any;
  gradNurseID?: string;
  link?: string;
  guestToken?: string;
}

interface SOCKET_PAYLOAD {
  set?: string;
  id: string;
  key: string;
  index: number,
  data: SOCKET_PAYLOAD_DATA;
  command: string;
  room: string;
}

export class SocketIO {
  room: Socket;

  constructor(id: string) {
    this.room = io(SOAP_BOX_URL, { query: { room: id } });
  }

  connect(callback: () => void) {
    this.room.on(CONNECT, callback);
  }

  listen(event: string, callback: (event: string, payload: SOCKET_PAYLOAD) => void) {
    this.room.on(event, (payload: SOCKET_PAYLOAD) => {
      if (payload.command === APPEND) {
        callback(APPEND, payload);
      }

      if (payload.command === REMOVE) {
        callback(REMOVE, payload);
      }

      if (payload.command === HSET) {
        callback(HSET, payload);
      }

      if (payload.data?.event === MEMBERS_UPDATE) {
        callback(MEMBERS_UPDATE, payload);
      }

      if (payload.id === INIT_LIST) {
        callback(INIT_LIST, payload);
      }

      callback('', payload);
    });
  }

  emit(eventName: string, payload: any) {
    this.room.emit(eventName, payload);
  }
}
