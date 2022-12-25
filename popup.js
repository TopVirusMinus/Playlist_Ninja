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

  var button = document.createElement("button");
  button.textContent = "Copy to Clipboard";
  button.addEventListener("click", () => copyFeedback());

  // Join the playlist into a single string, with a breakline after each video
  button.addEventListener("click", function () {
    // Join the playlist into a single string
    var text = playlist
      .map(function (video, index) {
        return `${index + 1}. ${video}`;
      })
      .join("\n");

    // Copy the text to the clipboard
    navigator.clipboard.writeText(text);
  });
  document.getElementById("playlist-container").appendChild(button);

  function copyFeedback() {
    var feedback = document.getElementById("feedback");
    feedback.classList.add("show");

    // Hide the feedback message after 3 seconds
    setTimeout(function () {
      feedback.classList.remove("show");
    }, 1000);
  }
  // Loop through the playlist and create a list item for each video
  playlist.forEach(function (video) {
    var li = document.createElement("li");
    li.textContent = video;
    ol.appendChild(li);
  });
  document.getElementById("playlist-container").appendChild(ol);
}
