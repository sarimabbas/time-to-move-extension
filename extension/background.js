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

  // set the ical feed from options.html / options.js
  else if (request.message === "set_ical_feed" && request.payload) {
    ical_feed = request.payload;
    console.log(request);
  }

  // give the ical feed to whoever needs it
  else if (request.message === "get_ical_feed") {
    sendResponse({ message: "success", payload: ical_feed });
  }

  return true;
});

<<<<<<< Updated upstream:extension/background.js
// web blocker
chrome.webRequest.onBeforeRequest.addListener(
  function() {
      return {cancel: true};
  },
  {
      urls: ["<all_urls>"]
  },
  ["blocking"]
);
=======
// monitor if in break time every minute
setInterval(async () => {
  // if the ical feed is set
  if (ical_feed) {
    // get today events every minute
    const todayEvents = await getCalendarFeed(ical_feed);
    console.log("Today's events are: ", todayEvents);

    // pass them to the scheduler
    const breakTimes = await scheduler(todayEvents);
    console.log("Today's scheduled breaks are: ", breakTimes);
    

    // loops through the breakTimes array, checking if the current time is within any breaktimes

    let inBreak = false;
  
    var i;
    for (i = 0; i < breakTimes.length; i++) {
      var date = Date();
      var min = breakTimes[i]["start"];
      var max = breakTimes[i]["end"];
      var isBetween = (date, min, max) => (date.getTime() >= min.getTime() && date.getTime() <= max.getTime());

      if (isBetween=true) {
        inBreak = true;
        break
      } else {
        inBreak = false;
      }

      console.log(inBreak)
    } 
   
    // if (inBreak = true) {
    //   chrome.webRequest.onBeforeRequest.addListener(
    //     function() {
    //         return {cancel: true};
    //     },
    //     {
    //         urls: ["<all_urls>"]
    //     },
    //     ["blocking"]
    //   );

    //   chrome.notifications.create("", {
    //     type: "basic",
    //     iconUrl: "icon.png",
    //     title: "Time to Move!",
    //     message: "Time to Move!",
    //   });
    // }

    
    // // TODO: create a notification if inside a break
    
  }
}, 5000);
>>>>>>> Stashed changes:extension/background/background.js
