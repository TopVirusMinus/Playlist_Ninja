// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "get-playlist") {
    // Get the playlist and send it back to the popup
    var playlist = getPlaylist();
    sendResponse({ playlist: playlist });
  }
});

function getPlaylist() {
  // Find all the video titles on the page
  var videoElements = document.querySelectorAll(".ytd-playlist-video-renderer");

  // Convert the NodeList to an array and extract the video names
  var playlist = Array.from(videoElements).map(function (videoElement) {
    return videoElement.title;
  });

  playlist = playlist.filter(function (video) {
    return video.trim() !== "";
  });
  //console.log(playlist);
  return playlist;
}
