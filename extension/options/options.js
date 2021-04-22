// https://developer.chrome.com/docs/extensions/mv2/options/

document.addEventListener("blur", function (event) {
  // chrome.extension
  //   .getBackgroundPage()
  //   .console.log("Someone typed in an iCal link");

  const inputText = event.currentTarget.value;

  // send the entered URL to background.js
  chrome.runtime.sendMessage(
    { message: "ical_feed_entered", payload: inputText },
    function (response) {}
  );
});
