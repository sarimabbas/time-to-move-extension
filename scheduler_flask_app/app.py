# app.py
from flask import Flask, request, jsonify
import pprint
import datetime as dt
import pandas as pd
import numpy as np
from flask_cors import CORS
from dateutil import parser


pp = pprint.PrettyPrinter(indent=4)

app = Flask(__name__)
CORS(app)


def getFreeTimes(busy_times, user_BOD, user_EOD):

    # busy_times: comes from user calendar
    # user_BOD: user beginning of day (input)
    # user_EOD: user end of day (input)

    freeTimes = pd.DataFrame()

    # beginning of day
    if busy_times.iloc[0, 0] > user_BOD:
        startFree_BOD = user_BOD
        end_first_free = busy_times.iloc[0, 0]

        first_free = pd.DataFrame(
            {"start": [startFree_BOD], "end": [end_first_free]})

        freeTimes = freeTimes.append(first_free)

    # during day events
    for i in np.arange(0, len(busy_times) - 1):

        startFree = busy_times.iloc[i, 1]
        endFree = busy_times.iloc[i + 1, 0]

        free = pd.DataFrame({"start": [startFree], "end": [endFree]})

        freeTimes = freeTimes.append(free)

    # end of day case
    if busy_times.iloc[len(busy_times) - 1, 1] < user_EOD:
        startFree_EOD = busy_times.iloc[len(busy_times) - 1, 1]
        EOD = user_EOD

        last_free = pd.DataFrame({"start": [startFree_EOD], "end": [EOD]})
        freeTimes = freeTimes.append(last_free)

    return freeTimes


def find_breakTimes(
    # all of these are user inputs except for freeTimes
    freeTimes, break_length, time_between_breaks, time_after_busy, user_BOD
):

    breakTimes = []

    # first break of the day:
    startBreak = user_BOD + (45 * 60)
    endBreak = startBreak + (break_length * 60)
    one_break = [startBreak, endBreak]

    # start of break bust be in the free time
    if (freeTimes.iloc[0, 0]) < startBreak < (freeTimes.iloc[0, 1]):
        # end of break bust be in the free time
        if (freeTimes.iloc[0, 0]) < endBreak < (freeTimes.iloc[0, 1]):
            breakTimes.append(one_break)

    for i in np.arange(0, len(freeTimes)):
        # break starts user input amount of mins after beginning of free time (= end of busy time)
        startBreak = freeTimes.iloc[i, 0] + (time_after_busy * 60)
        endBreak = startBreak + (break_length * 60)

        possible_break = [startBreak, endBreak]

        # schedule the break if the start and the end of the break are during free time
        # possible break start must be after already scheduled break end

        # start of possible break must be greater than end of the first manually scheduled break
        if (possible_break[0]) > (breakTimes[0][1]):
            # start of break bust be in the free time
            if (freeTimes.iloc[i, 0]) < startBreak < (freeTimes.iloc[i, 1]):
                # end of break bust be in the free time
                if (freeTimes.iloc[i, 0]) < endBreak < (freeTimes.iloc[i, 1]):
                    breakTimes.append(possible_break)

        # while the end of the break is less than the end of the free time, schedule more breaks
        while possible_break[1] < freeTimes.iloc[i, 1]:
            startBreak = possible_break[1] + (time_between_breaks * 60)

            # currently a 10 minute break -- should be adjustable for user input
            endBreak = startBreak + (break_length * 60)

            possible_break = [startBreak, endBreak]

            # schedule break if start and end are in free period
            if (freeTimes.iloc[i, 0]) < startBreak < (freeTimes.iloc[i, 1]):
                if (freeTimes.iloc[i, 0]) < endBreak < (freeTimes.iloc[i, 1]):
                    breakTimes.append(possible_break)

    return breakTimes


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "GET":
        return "Hello and welcome to the server!"

    simulatedBreaks = []

    time = dt.datetime.now()
    startBreak = time.replace(hour=9, minute=0, second=0).timestamp()

    for i in np.arange(0, 40):
        endBreak = startBreak + (10 * 60)

        possible_break = [startBreak, endBreak]
        simulatedBreaks.append(possible_break)

        startBreak = possible_break[1] + (10 * 60)  # 10 minutes between breaks


return jsonify(simulatedBreaks)


def indexCopy():

    if request.method == "GET":
        return "Hello and welcome to the server!"

    # get the data sent from javascript
    eventListFromClientSide = request.json

    # convert the date time to timestamps
    for event in eventListFromClientSide:
        event["start"] = parser.parse(event["start"]).timestamp()
        event["end"] = parser.parse(event["end"]).timestamp()
    pp.pprint(eventListFromClientSide)

    # eventListFromClientSide[0]["start"]

    busyTimes = pd.DataFrame({"start": (), "end": ()})

    for i in np.arange(0, len(eventListFromClientSide)-1):
        oneEvent = [eventListFromClientSide[i]["start"],
                    eventListFromClientSide[i]["end"]]
        busyTimes = busyTimes.append(oneEvent)

    # hardcoded stuff
    time = dt.datetime.now()
    BOD = time.replace(hour=8, minute=0, second=0).timestamp()
    EOD = time.replace(hour=17, minute=0, second=0).timestamp()

    user_freeTimes = getFreeTimes(busyTimes, BOD, EOD)
    user_breakTimes = find_breakTimes(
        user_freeTimes,
        break_length=10,  # these would be changed to user inputs
        time_between_breaks=45,
        time_after_busy=15,
        user_BOD=BOD,
    )

    # breakTimes_dict = user_breakTimes.to_dict("list")

    print(user_breakTimes)

    return jsonify(user_breakTimes)


if __name__ == "__main__":
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
