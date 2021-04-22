// https://developer.chrome.com/docs/extensions/mv2/options/

document
  .querySelector("#ical-input")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;

    // send the entered URL to background.js
    chrome.runtime.sendMessage(
      { message: "ical_feed_entered", payload: inputText },
      function (response) {}
    );
  });
