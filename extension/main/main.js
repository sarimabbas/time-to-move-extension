const logger = (...msg) =>
  chrome.extension.getBackgroundPage().console.log(...msg);

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("../options/options.html"));
  }
});

document.querySelector("#sign-out").addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "sign_out" }, function (response) {
    if (response.message === "success") {
      window.location.replace("../login/login.html");
    }
  });
});

function init() {
  // EXAMPLE: get the ical feed to show
  chrome.runtime.sendMessage({ message: "get_ical_feed" }, function (response) {
    if (response.message === "success" && response.payload) {
      document.querySelector("#ical-feed-holder").innerText = response.payload;
    }
  });

  // EXAMPLE: get the breaks
  chrome.runtime.sendMessage({ message: "get_breaks" }, function (response) {
    if (response.message === "success" && response.payload) {
      document.querySelector("#breaks-holder").innerText = JSON.stringify(
        response.payload
      );
    }
  });
}

init();
