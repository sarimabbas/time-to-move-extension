// these are global variables that exist over the lifetime of the extension
// (i.e. whenever Google Chrome is open)
// if you want to store things longer you need the storage API
let user_signed_in = false;
let ical_feed = "";

// the chrome runtime passes messages between the scripts in the frontend and this "backend" script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // you can ask if the user is signed in from the frontend with this
  if (request.message === "is_user_signed_in") {
    sendResponse({
      message: "success",
      payload: user_signed_in,
    });
  }
  // you can sign people out with this
  else if (request.message === "sign_out") {
    user_signed_in = false;
    sendResponse({ message: "success" });
  }
  // this message is sent by the login.js upon successful sign in
  else if (request.message === "sign_in") {
    user_signed_in = true;
    sendResponse({ message: "success" });
  }

  // get the ical feed from options.html / options.js
  else if (request.message === "ical_feed_entered" && request.payload) {
    ical_feed = request.payload;
    console.log(request);
  }

  //
  else if (request.message === "get_ical_feed") {
    sendResponse({ message: "success", payload: ical_feed });
  }

  return true;
});
