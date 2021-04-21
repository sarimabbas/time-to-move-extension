function freeTimes(busyTimes){
  // busyTime = dataframe with column for start times, column for end times, row corresponds to an event
  //            start     end
  // event 1    ...       ...
  // event 2    ...       ...

  // freeTime = dataframe with same set up as busyTime
  //            start                       end
  // event 1    = busyTime event1 end       = busyTime event2 start
  // event 2    = busyTime event2 end       = busyTime event 3 start

  for i in length(busyTimes/2){
    freeTimes = pd.DataFrame({'start': , 'end': })
    freeTimes.iloc[i,:] = busyTimes.iloc[i, 1]
    freeTimes.iloc[]

  }

}







// https://stackoverflow.com/questions/48407713/get-available-time-ranges-from-an-array-of-busy-time-ranges

function giveTime(start) {
  var t = moment().format("YYYY-MM-DD");
  var t1 = t + " " + start;
  return moment(t1, "YYYY-MM-DD h:mm A").format();
}

// const timeRange = [
//   {
//     start: "9:00 AM",
//     end: "10:00 AM",
//   },
//   {
//     start: "12:00 PM",
//     end: "2:00 PM",
//   },
//   {
//     start: "5:00 PM",
//     end: "7:00 PM",
//   },
//   {
//     start: "11:00 AM",
//     end: "3:00 PM",
//   },
//   {
//     start: "6:00 PM",
//     end: "9:00 PM",
//   },
// ];

// timeRange.sort((a, b) => {
todayEvents.sort((a, b) => {
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

// timeRange.forEach((element, index) => {
todayEvents.forEach((element, index) => {
  let currentEndTime = moment(giveUtc(element.end));
  const currentStartTime = moment(giveUtc(element.start));

  // if (currentStartTime.isBefore(startTimeMinimum)) {
  //   startTimeMinimum = currentStartTime;
  // }

  // if (currentEndTime.isAfter(endTimeFarthest)) {
  //   endTimeFarthest = currentEndTime;
  // }

  /* console.log(startTimeMinimum.format("h:mm A"), endTimeFarthest.format("h:mm A")) */
  // if (index === timeRange.length - 1) {
  if (index === todayEvents.length - 1) {
    if (timeRange.length === 1) {
      availableTimeArray.push({
        start: "00:00 AM",
        end: currentStartTime.format("h:mm A"),
      });
    }
    availableTimeArray.push({
      //start: currentEndTime.format("h:mm A"),
      start: endTimeFarthest.format("h:mm A"),
      end: "11.59 PM",
    });
  } else {
    // const nextBusyTime = timeRange[index + 1];
    const nextBusyTime = todayEvents[index + 1];
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
