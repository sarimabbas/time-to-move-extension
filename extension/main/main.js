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
