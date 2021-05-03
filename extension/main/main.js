// To debug this file, right click the popup and Inspect Element

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
  console.log("initializing");

  // EXAMPLE: get the ical feed to show
  chrome.runtime.sendMessage({ message: "get_ical_feed" }, function (response) {
    if (response.message === "success" && response.payload) {
      document.querySelector("#ical-feed-holder").innerText = response.payload;
    }
  });

  // EXAMPLE: get the user info
  chrome.runtime.sendMessage({ message: "get_user" }, function (response) {
    if (response.message === "success" && response.payload) {
      document.querySelector("#user-welcome").innerText =
        "Welcome, " + response.payload.name;
    }
  });

  // EXAMPLE: get the breaks
  chrome.runtime.sendMessage({ message: "get_breaks" }, function (response) {
    if (response.message === "success" && response.payload) {
      const todayBreaks = response.payload?.map((t) => {
        return {
          start: new Date(t.start),
          end: new Date(t.end),
        };
      });
      console.log("received this from background", todayBreaks);

      const now = new Date();
      const upcomingBreaks = todayBreaks.filter((b) => b.start > now);

      document.querySelector("#breaks-holder").innerText = JSON.stringify(
        upcomingBreaks
      );
    }
  });
}

init();
