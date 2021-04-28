// https://developer.chrome.com/docs/extensions/mv2/options/

document
  .querySelector("#ical-input")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "set_ical_feed",
      payload: inputText,
    });
  });

document
  .querySelector("#femail")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "friends email",
      payload: inputText,
    });
  });

document
  .querySelector("#bpDay")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "set breaks per day",
      payload: inputText,
    });
  });

document
  .querySelector("#bpMin")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "set breaks each minute",
      payload: inputText,
    });
  });

document
  .querySelector("#bLength")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "set break length",
      payload: inputText,
    });
  });

document
  .querySelector("#goal")
  .addEventListener("blur", function (event) {
    const inputText = event.currentTarget.value;
    // send the entered URL to background.js
    chrome.runtime.sendMessage({
      message: "set goal breaks",
      payload: inputText,
    });
  });
