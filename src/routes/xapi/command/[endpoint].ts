import { webexHttp } from '../../../lib/webex/http-wrapper/webex-http';

const webexBotToken: string = process.env.WEBEX_BOT_TOKEN || '';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function joinWebRtcPersonal(request) {
  const url = await request.url.searchParams.get('url');
  const type = await request.url.searchParams.get('type');
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
        operation: 'WebRTC.Join',
        arguments: { Url: url, Type: type, Title: type }
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
    default:
      return { status: 404 };
  }
}
