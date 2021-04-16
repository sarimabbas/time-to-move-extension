// this function parses an iCal feed e.g. from Google Calendar
// it gets the raw data of the feed and transforms it into a list of events
async function getCalendarFeed(feedURL) {
  console.log("Getting calendar feed: %s", feedURL);

  // first, fetch the iCAL feed from the URL
  const response = await fetch(
    "https://time-to-move-cors-fetcher.herokuapp.com/" + feedURL
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
  const todayEvents = eventItems.filter(
    (e) => isToday(e?.start) || isToday(e?.end)
  );

  return todayEvents;
}

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

// YOUR TASK: given a list of today's events, can you...
//         1. figure out which parts of the day are free
//         2. output a list of objects which are suggested breaks
// the format of each break object should be as follows:
// { start: Date(), end: Date() }
function scheduler(todayEvents) {
  // here is a sample list with a break time scheduled for right now

  // create a break starting right now for 20 minutes into the future
  const start = new Date();
  const end = new Date();
  end.setMinutes(start.getMinutes() + 20);
  const breakTimes = [
    {
      start: start,
      end: end,
    },
  ];

  return breakTimes;
}

// this is our main function
async function main() {
  console.log("Starting up main...");

  // get a list of todays events
  const todayEvents = await getCalendarFeed(
    "https://calendar.google.com/calendar/ical/sarim.stays%40gmail.com/public/basic.ics"
  );
  console.log("Today's events are: ", todayEvents);

  // pass them to the scheduler
  const breakTimes = scheduler(todayEvents);
  console.log("Today's scheduled breaks are: ", breakTimes);
}

// run main
main();