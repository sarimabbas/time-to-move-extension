// checks if a Date() object occurs today
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// this function parses an iCal feed e.g. from Google Calendar
// it gets the raw data of the feed and transforms it into a list of events
async function getCalendarFeed(feedURL) {
  console.log("Getting calendar feed: %s", feedURL);

  // first, fetch the iCAL feed from the URL
  const response = await fetch(
    "https://time-to-move-cors-fetcher.herokuapp.com/" + feedURL,
    {
      method: "GET",
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    }
  );
  const feedData = await response.text();

  // parse the feed into JavaScript objects
  const parsedItems = Object.values(ical.parseICS(feedData));
  const eventItems = parsedItems.filter((e) => e?.type === "VEVENT");

  // each event has a start and an end. These are Date() objects
  // the reference for handling Dates is given here: https://www.w3schools.com/jsref/jsref_obj_date.asp

  // filter the events so that you only have events for TODAY
  // the heuristic used is that if an events starts or ends today, it is probably today
  // but this probably doesn't solve all edge cases e.g. what if you had an event that started yesterday and ends tomorrow?
  // but this is good enough for now
  const todayEvents = eventItems
    .filter((e) => isToday(e?.start) || isToday(e?.end))
    .sort((a, b) => a?.start - b?.start);

  return todayEvents;
}

// YOUR TASK: given a list of today's events, can you...
//         1. figure out which parts of the day are free
//         2. output a list of objects which are suggested breaks
// the format of each break object should be as follows:
// { start: Date(), end: Date() }
async function scheduler(todayEvents) {
  // use http://127.0.0.1:5000/ as the URL if working locally
  // use https://time-to-move-scheduler.herokuapp.com/ as the URL if committing to GitHub
  const response = await fetch("http://127.0.0.1:5000/", {
    method: "POST",
    body: JSON.stringify(todayEvents),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseText = await response.text();
  const responseData = JSON.parse(responseText);

  // convert the Python timestamps to JS data again
  const breakTimes = responseData.map((b) => {
    return {
      start: new Date(b[0] * 1000),
      end: new Date(b[1] * 1000),
    };
  });

  return breakTimes;
}
