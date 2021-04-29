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
  chrome.runtime.sendMessage({ message: "get_ical_feed" }, function (response) {
    if (response.message === "success" && response.payload) {
      document.querySelector("#ical-feed-holder").innerText = response.payload;
    }
  });
}


// // listener for the "abort button" on the breakpage
// document.addEventListener('DOMContentLoaded', function () {
//   var checkPageButton = document.getElementById("quitBreak");
//     checkPageButton.addEventListener('click', function(){
//         inBreak= false;
//         console.log("successfully pressed!")
//   });
// });

init();
