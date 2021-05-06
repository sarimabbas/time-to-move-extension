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

var countDownDate = new Date("May 6, 2021 11:30:00").getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("ppt").innerHTML =
    hours + " : " + minutes + " : " + seconds;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("ppt").innerHTML = "Breaktime!";
  }
}, 1000);
