// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function get(request) {
  switch (request.params?.endpoint) {
    case 'webrtc.join':
      return {};
    default:
      return { status: 404 };
  }
}
