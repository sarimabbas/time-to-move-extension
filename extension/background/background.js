// these are global variables that exist over the lifetime of the extension
// (i.e. whenever Google Chrome is open)
// if you want to store things longer you need the storage API
let ical_feed = "";
let breakTimes = [];
let breaksTaken = 0;
let breaksSnoozed = 0;
let inBreak = false;
let clicked = false;
let counterVar = 0;

// user variables
let user_signed_in = false;
let user = {
  name: "",
  email: "",
  uid: "",
};

function contentBlocker() {
  return { cancel: true };
}

console.log(chrome.webRequest.onBeforeRequest);

async function fetchBreaks() {
  try {
    // get today events every minute
    const todayEvents = await getCalendarFeed(ical_feed);
    console.log("Today's events are: ", todayEvents);

    // pass them to the scheduler
    const newBreakTimes = await scheduler(todayEvents);
    console.log("Today's scheduled breaks are: ", breakTimes);
    breakTimes = newBreakTimes;
  } catch (e) {}
}

// the chrome runtime passes messages between the scripts in the frontend and this "backend" script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
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
  else if (request.message === "sign_in" && request.payload) {
    user_signed_in = true;
    user.email = request.payload?.user?.email;
    user.name = request.payload?.user?.displayName;
    user.uid = request.payload?.user?.uid;
    sendResponse({ message: "success" });
  }

  // set the ical feed from options.html / options.js
  else if (request.message === "set_ical_feed" && request.payload) {
    ical_feed = request.payload;
    await fetchBreaks();
    sendResponse({ message: "success" });
  }

  // give the ical feed to whoever needs it
  else if (request.message === "get_user") {
    sendResponse({ message: "success", payload: user });
  }

  // give the ical feed to whoever needs it
  else if (request.message === "get_ical_feed") {
    sendResponse({ message: "success", payload: ical_feed });
  }

  // get the breaks
  else if (request.message === "get_breaks") {
    sendResponse({ message: "success", payload: breakTimes });
  }

  // snooze break
  else if (request.message === "snooze") {
    breaksSnoozed++;
    sendResponse({ message: "success" });
  }

  return true;
});

// monitor if in break time every minute
setInterval(async () => {
  // fetch events every minute
  if (ical_feed) {
    console.log("fetching breaks");
    await fetchBreaks();
    console.log("got", breakTimes);
  }

  console.log("break times", breakTimes);

  // if the ical feed is set
  if (breakTimes.length > 0) {
    // loops through the breakTimes array, checking if the current time is within any breaktimes
    for (let i = 0; i < breakTimes.length; i++) {
      var date = new Date();
      var min = breakTimes[i]["start"];
      var max = breakTimes[i]["end"];
      var isBetween = (date, min, max) =>
        date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

      if (isBetween(date, min, max) === true) {
        inBreak = true;
        break;
      } else {
        inBreak = false;
      }
      console.log(inBreak);
    }

    if (inBreak === true) {
      console.log("starting block");
      chrome.webRequest.onBeforeRequest.addListener(
        contentBlocker,
        {
          urls: ["*://*/*"],
        },
        ["blocking"]
      );

      if (counterVar === 0) {
        window.open(chrome.runtime.getURL("../options/pages/breakpage.html"));
        chrome.tabs.query({ status: "complete" }, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url) {
              chrome.tabs.update(tab.id, { url: tab.url });
            }
          });
        });
        counterVar++;
        console.log(counterVar);
      }
    } else {
      console.log("removing block");
      chrome.webRequest.onBeforeRequest.removeListener(
        contentBlocker,
        {
          urls: ["<all_urls>"],
        },
        ["blocking"]
      );

      if (counterVar === 1) {
        chrome.tabs.query({ status: "complete" }, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url) {
              chrome.tabs.update(tab.id, { url: tab.url });
            }
          });
        });
        counterVar--;
        console.log(counterVar);
      }
    }
  }
}, 30000);
