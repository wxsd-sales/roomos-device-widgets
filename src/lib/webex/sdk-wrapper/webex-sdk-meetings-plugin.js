export class WebexSdkMeetingsPlugin {
  /**
   * Registers the meetings' plugin if not already registered.
   *
   * @param {Webex} webex
   *
   * @returns {Promise<Webex>}
   */
  register(webex) {
    return new Promise((resolve) => {
      if (!webex.meetings.registered) {
        webex.meetings.register().then(() => resolve(webex));
      } else {
        resolve(webex);
      }
    });
  }

  /**
   * Starts the meeting for a particular destination.
   *
   * @param {Webex} webex
   * @param {string} destination
   * @param {HTMLVideoElement} localVideo
   * @param {HTMLVideoElement | null} localShare
   * @param {HTMLAudioElement} remoteAudio
   * @param {HTMLVideoElement} remoteVideo
   * @param {HTMLVideoElement | null} remoteShare
   * @param {HTMLButtonElement} toggleAudioButton
   * @param {HTMLButtonElement} toggleVideoButton
   * @param {HTMLButtonElement} toggleShareButton
   * @param {HTMLButtonElement} hangupButton
   * @param {function(boolean): void} handleAudioChange
   * @param {function(boolean): void} handleVideoChange
   * @param {function(boolean): void} handleShareChange
   * @param {function} handleMeetingLeave
   * @param {function} handleMediaReady
   *
   * @returns {Promise<Meeting>}
   */
  startMeeting(
    webex,
    destination /* eslint-disable @typescript-eslint/no-unused-vars */,
    localVideo,
    localShare,
    remoteAudio,
    remoteVideo,
    remoteShare,
    toggleAudioButton,
    toggleVideoButton,
    toggleShareButton,
    hangupButton,
    handleAudioChange,
    handleVideoChange,
    handleShareChange,
    handleMeetingLeave,
    handleMediaReady /* eslint-disable @typescript-eslint/no-unused-vars */
  ) {
    return new Promise((resolve, reject) => {
      webex.meetings.create(destination).then((meeting) => {
        // Call our helper function for binding events to meetings
        const [, , ...bindings] = arguments;
        this.#bindMeetingEvents(meeting, ...bindings);
        this.#joinMeeting(meeting);
        resolve(meeting);
      });
    });
  }

  /**
   * Helper to binds to the events during a meeting.
   *
   * @param {Meeting} meeting
   * @param {HTMLVideoElement} localVideo
   * @param {HTMLVideoElement | null} localShare
   * @param {HTMLAudioElement} remoteAudio
   * @param {HTMLVideoElement} remoteVideo
   * @param {HTMLVideoElement | null} remoteShare
   * @param {HTMLButtonElement} toggleAudioButton
   * @param {HTMLButtonElement} toggleVideoButton
   * @param {HTMLButtonElement} toggleShareButton
   * @param {HTMLButtonElement} hangupButton
   * @param {function(boolean): void} handleAudioChange
   * @param {function(boolean): void} handleVideoChange
   * @param {function(boolean): void} handleShareChange
   * @param {function} handleMeetingLeave
   * @param {function} handleMediaReady
   *
   * @returns Void
   */
  #bindMeetingEvents(
    meeting,
    localVideo,
    localShare,
    remoteAudio,
    remoteVideo,
    remoteShare,
    toggleAudioButton,
    toggleVideoButton,
    toggleShareButton,
    hangupButton,
    handleAudioChange,
    handleVideoChange,
    handleShareChange,
    handleMeetingLeave,
    handleMediaReady
  ) {
    /**
     * @param {{ type: string; stream?: MediaStream }} media
     * @param isReady
     */
    const toggleStream = (media, isReady) => {
      if (isReady && !media) {
        return;
      }

      switch (media.type) {
        case 'local':
          if (localVideo) localVideo.srcObject = isReady ? media.stream : null;
          handleAudioChange(meeting.isAudioMuted());
          handleVideoChange(meeting.isVideoMuted());
          break;
        case 'localShare':
          if (localShare) localShare.srcObject = isReady ? media.stream : null;
          handleShareChange(meeting.isSharing);
          break;
        case 'remoteAudio':
          if (remoteAudio) remoteAudio.srcObject = isReady ? media.stream : null;
          break;
        case 'remoteVideo':
          if (remoteVideo) remoteVideo.srcObject = isReady ? media.stream : null;
          break;
        case 'remoteShare':
          if (remoteShare) remoteShare.srcObject = isReady ? media.stream : null;
          break;
        default:
          console.warn(`Unknown media: ${media}`);
      }
    };

    meeting.on('error', (err) => {
      console.error(err);
    });

    meeting.on('media:ready', (media) => toggleStream(media, true));
    meeting.on('media:stopped', (media) => toggleStream(media, false));
    meeting.on('meeting:stoppedSharingLocal', () => toggleStream({ type: 'localShare' }, false));
    meeting.on('meeting:stoppedSharingRemote', () => toggleStream({ type: 'remoteShare' }, false));

    toggleAudioButton.onclick = () =>
      meeting.isAudioMuted()
        ? meeting.unmuteAudio().then(() => handleAudioChange(meeting.isAudioMuted()))
        : meeting.muteAudio().then(() => handleAudioChange(meeting.isAudioMuted()));
    toggleVideoButton.onclick = () =>
      meeting.isVideoMuted()
        ? meeting.unmuteVideo().then(() => handleVideoChange(meeting.isVideoMuted()))
        : meeting.muteVideo().then(() => handleVideoChange(meeting.isVideoMuted()));
    toggleShareButton.onclick = () =>
      meeting.isSharing
        ? meeting.stopShare().then(() => handleShareChange(meeting.isSharing))
        : meeting.shareScreen().then(() => handleShareChange(meeting.isSharing));

    hangupButton.onclick = () => meeting.leave();

    // TODO: Update meeting member event bindings.

    meeting.members.on('members:update', (payload) => {
      const delta = payload.delta;
      const full = payload.full;
      const updated = delta.updated;
      const added = delta.added;
      Object.keys(full).forEach((key) => {
        const member = full[key];
        console.log(`Member: ... `, member);
      });
      Object.keys(updated).forEach((key) => {
        const member = updated[key];
        console.log(`Member Updated:`, member);
      });
      Object.keys(added).forEach((key) => {
        const member = added[key];
        console.log(`Member Added:`, member);
      });
    });

    // content updates
    meeting.members.on('members:content:update', (payload) => {
      console.log(payload);
      console.log(`who started sharing: ${payload.activeSharingId};`);
      console.log(`who stopped sharing: ${payload.endedSharingId};`);
    });

    // host updates
    meeting.members.on('members:host:update', (payload) => {
      console.log(payload);
      console.log(`who started hosting: ${payload.activeHostId};`);
      console.log(`who stopped hosting: ${payload.endedHostId};`);
    });

    // self updates, not typically used
    meeting.members.on('members:self:update', (payload) => {
      console.log(payload);
      console.log(`active self id: ${payload.activeSelfId};`);
      console.log(`ended self Id: ${payload.endedSelfId};`);
    });
  }

  /**
   * Helper to start the meeting.
   *
   * @param {Meeting} meeting
   *
   * @returns Void
   */
  #joinMeeting(meeting) {
    meeting.join().then(() => {
      const mediaSettings = {
        receiveVideo: true,
        receiveAudio: true,
        receiveShare: true,
        sendVideo: true,
        sendAudio: true,
        sendShare: false
      };
      // Get our local media stream and add it to the meeting
      return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
        const [localStream, localShare] = mediaStreams;
        meeting.addMedia({ localShare, localStream, mediaSettings });
      });
    });
  }
}

/**
 * Instantiates the Webex SDK Meetings Plugin wrapper.
 *
 * @returns {WebexSdkMeetingsPlugin}
 */
export const webexSdkMeetingsPlugin = () => new WebexSdkMeetingsPlugin();
