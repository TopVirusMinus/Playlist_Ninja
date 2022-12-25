// Listen for clicks on the "Get Playlist" button
document
  .getElementById("get-playlist-button")
  .addEventListener("click", getPlaylist);

function getPlaylist() {
  // Send a message to the content script to get the playlist
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "get-playlist" },
      function (response) {
        // Display the playlist in the popup window
        displayPlaylist(response.playlist);
      }
    );
  });
}

function displayPlaylist(playlist) {
  // Clear the playlist container
  document.getElementById("playlist-container").innerHTML = "";
  var ol = document.createElement("ol");

  // Loop through the playlist and create a list item for each video
  playlist.forEach(function (video) {
    var li = document.createElement("li");
    li.textContent = video;
    ol.appendChild(li);
  });
  document.getElementById("playlist-container").appendChild(ol);
}
