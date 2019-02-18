const twilioVideo = require('twilio-video');

/**
 * Display local video in the given HTMLVideoElement.
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
function displayLocalVideo(video) {
    return twilioVideo.createLocalVideoTrack().then(function(localTrack) {
      localTrack.attach(video);
    });
  }

//EXPORTS
module.exports.displayLocalVideo = displayLocalVideo;