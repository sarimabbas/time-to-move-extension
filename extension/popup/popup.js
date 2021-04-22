function init() {
  chrome.runtime.sendMessage(
    { message: "is_user_signed_in" },
    function (response) {
      if (response.message === "success" && response.payload) {
        window.location.replace("../main/main.html");
      } else {
        window.location.replace("../login/login.html");
      }
    }
  );
}

init();
