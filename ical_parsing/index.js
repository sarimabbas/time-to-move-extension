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
  // https://stackoverflow.com/questions/48407713/get-available-time-ranges-from-an-array-of-busy-time-ranges

  function giveTime(start) {
    var t = moment().format("YYYY-MM-DD");
    var t1 = t + " " + start;
    return moment(t1, "YYYY-MM-DD h:mm A").format();
  }

  const timeRange = [
    {
      start: "9:00 AM",
      end: "10:00 AM",
    },
    {
      start: "12:00 PM",
      end: "2:00 PM",
    },
    {
      start: "5:00 PM",
      end: "7:00 PM",
    },
    {
      start: "11:00 AM",
      end: "3:00 PM",
    },
    {
      start: "6:00 PM",
      end: "9:00 PM",
    },
  ];

  timeRange.sort((a, b) => {
    var timeA = giveTime(a.start);
    var timeB = giveTime(b.start);
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    return 0;
  });

  const availableTimeArray = [];

  // will have to be adjusted for user input
  let endTimeFarthest = moment(giveUtc("8.00 AM"));
  let startTimeMinimum = moment(giveUtc("8.00 PM"));

  timeRange.forEach((element, index) => {
    let currentEndTime = moment(giveUtc(element.end));
    const currentStartTime = moment(giveUtc(element.start));

    // if (currentStartTime.isBefore(startTimeMinimum)) {
    //   startTimeMinimum = currentStartTime;
    // }

    // if (currentEndTime.isAfter(endTimeFarthest)) {
    //   endTimeFarthest = currentEndTime;
    // }

    /* console.log(startTimeMinimum.format("h:mm A"), endTimeFarthest.format("h:mm A")) */
    if (index === timeRange.length - 1) {
      if (timeRange.length === 1) {
        availableTimeArray.push({
          start: "00:00 AM",
          end: currentStartTime.format("h:mm A"),
        });
      }
      availableTimeArray.push({
        //start: currentEndTime.format("h:mm A"),
        start: endTimeFarthest.format("h:mm A"),
        end: "8.00 PM",
      });
    } else {
      const nextBusyTime = timeRange[index + 1];
      const nextStartTime = moment(giveTime(nextBusyTime.start));
      if (index === 0) {
        availableTimeArray.push({
          start: "00:00 AM",
          end: currentStartTime.format("h:mm A"),
        });
      }
      let endTimeToCompare = currentEndTime.isBefore(endTimeFarthest)
        ? endTimeFarthest
        : currentEndTime;
      if (endTimeToCompare.isBefore(nextStartTime)) {
        availableTimeArray.push({
          start: endTimeToCompare.format("h:mm A"),
          end: nextStartTime.format("h:mm A"),
        });
      }
    }
  });
  console.log(availableTimeArray);

  // create a break starting right now for 20 minutes into the future
  const start = new Date();
  const end = new Date();
  end.setMinutes(start.getMinutes() + 10);
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
    "https://calendar.google.com/calendar/ical/gabrielle.branin%40yale.edu/public/basic.ics"
  );
  console.log("Today's events are: ", todayEvents);

  // pass them to the scheduler
  const breakTimes = scheduler(todayEvents);
  console.log("Today's scheduled breaks are: ", breakTimes);
}

// run main
main();
