import { webexHttp } from '../../../lib/webex/http-wrapper/webex-http';

const webexBotToken: string = process.env.WEBEX_BOT_TOKEN || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function joinWebRtcPersonal(request) {
  const url = await request.url.searchParams.get('url');
  const type = await request.url.searchParams.get('type');
  const serial = await request.url.searchParams.get('serial');
  const uuid = await request.url.searchParams.get('uuid');
  const deviceId: string = await webexHttp(webexBotToken, 'devices')
    .get('', { serial: serial })
    .then((r) => r.items[0])
    .then((r) => r.id);

  return await webexHttp(webexBotToken, 'xapi').post('command/Message.Send', undefined, {
    deviceId: deviceId,
    arguments: {
      Text: JSON.stringify({
        type: 'command',
        operation: 'WebRTC.Join',
        uuid: uuid,
        arguments: { Url: url, Type: type, Title: type }
      })
    }
  });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function dialPersonal(request) {
  const number = await request.url.searchParams.get('number');
  const serial = await request.url.searchParams.get('serial');
  const uuid = await request.url.searchParams.get('uuid');
  const deviceId: string = await webexHttp(webexBotToken, 'devices')
    .get('', { serial: serial })
    .then((r) => r.items[0])
    .then((r) => r.id);

  return await webexHttp(webexBotToken, 'xapi').post('command/Message.Send', undefined, {
    deviceId: deviceId,
    arguments: {
      Text: JSON.stringify({
        type: 'command',
        operation: 'Dial',
        uuid: uuid,
        arguments: { Number: number }
      })
    }
  });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function disconnect(request) {
  const serial = await request.url.searchParams.get('serial');
  const deviceId: string = await webexHttp(webexBotToken, 'devices')
    .get('', { serial: serial })
    .then((r) => r.items[0])
    .then((r) => r.id);

  return await webexHttp(webexBotToken, 'xapi').post('command/Message.Send', undefined, {
    deviceId: deviceId,
    arguments: {
      Text: JSON.stringify({
        type: 'command',
        operation: 'Call.Disconnect',
        arguments: {}
      })
    }
  });
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function get(request) {
  switch (request.params?.endpoint) {
    case 'webrtc.join':
      return joinWebRtcPersonal(request);
    case 'dial':
      return dialPersonal(request);
    case 'call.disconnect':
      return disconnect(request);
    default:
      return { status: 404 };
  }
}
