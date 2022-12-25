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

  // Create a checkbox for numbering the list
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "numbering";
  checkbox.value = "number";
  checkbox.id = "number";
  checkbox.checked = false;
  checkbox.addEventListener("change", function () {
    // Get the ordered list element
    var ul = document.querySelector("#playlist-container ul");

    // Get the list items
    var lis = ul.querySelectorAll("li");

    if (this.checked) {
      // The checkbox is checked, add numbering
      lis.forEach(function (li, index) {
        li.textContent = `${index + 1}. ${li.textContent}`;
      });
    } else {
      // The checkbox is not checked, remove numbering
      lis.forEach(function (li) {
        li.textContent = li.textContent.slice(3);
      });
    }
  });

  // Create a label for the checkbox
  var label = document.createElement("label");
  label.htmlFor = "number";
  label.textContent = "Number";

  // Append the checkbox and label to the playlist container
  document.getElementById("playlist-container").appendChild(checkbox);
  document.getElementById("playlist-container").appendChild(label);

  var ul = document.createElement("ul");

  var button = document.createElement("button");
  button.textContent = "Copy to Clipboard";
  button.addEventListener("click", () => copyFeedback());

  // Join the playlist into a single string, with a breakline after each video
  button.addEventListener("click", function () {
    // Join the playlist into a single string
    var text = playlist
      .map(function (video, index) {
        // Check if the checkbox is checked
        if (document.getElementById("number").checked) {
          // The checkbox is checked, include numbering in the text
          var li = document.createElement("li");
          li.textContent = video;
          ul.appendChild(li);
          return `${index + 1}. ${video}`;
        } else {
          // The checkbox is not checked, exclude numbering in the text
          return video;
        }
      })
      .join("\n\n");

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
    ul.appendChild(li);
  });
  document.getElementById("playlist-container").appendChild(ul);
}
