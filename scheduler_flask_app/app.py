# app.py
from flask import Flask, request, jsonify

import datetime as dt
import pandas as pd
import numpy as np

app = Flask(__name__)


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
            {'start': [startFree_BOD], 'end': [end_first_free]})

        freeTimes = freeTimes.append(first_free)

    # during day events
    for i in np.arange(0, len(busy_times)-1):

        startFree = busy_times.iloc[i, 1]
        endFree = busy_times.iloc[i+1, 0]

        free = pd.DataFrame({'start': [startFree], 'end': [endFree]})

        freeTimes = freeTimes.append(free)

    # end of day case
    if busy_times.iloc[len(busy_times)-1, 1] < user_EOD:
        startFree_EOD = busy_times.iloc[len(busy_times)-1, 1]
        EOD = user_EOD

        last_free = pd.DataFrame({'start': [startFree_EOD], 'end': [EOD]})
        freeTimes = freeTimes.append(last_free)

    return freeTimes


def find_breakTimes(freeTimes, break_length, time_between_breaks, time_after_busy, user_BOD):

    breakTimes = []

    # first break of the day:
    startBreak = user_BOD + (45*60)
    endBreak = startBreak + (break_length*60)
    one_break = [startBreak, endBreak]

    # start of break bust be in the free time
    if (freeTimes.iloc[0, 0]) < startBreak < (freeTimes.iloc[0, 1]):
        # end of break bust be in the free time
        if (freeTimes.iloc[0, 0]) < endBreak < (freeTimes.iloc[0, 1]):
            breakTimes.append(one_break)

    for i in np.arange(0, len(freeTimes)):
        # break starts user input amount of mins after beginning of free time (= end of busy time)
        startBreak = freeTimes.iloc[i, 0] + (time_after_busy*60)
        endBreak = startBreak + (break_length*60)

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
        while (possible_break[1] < freeTimes.iloc[i, 1]):
            startBreak = possible_break[1] + (time_between_breaks*60)

            # currently a 10 minute break -- should be adjustable for user input
            endBreak = startBreak + (break_length*60)

            possible_break = [startBreak, endBreak]

            # schedule break if start and end are in free period
            if (freeTimes.iloc[i, 0]) < startBreak < (freeTimes.iloc[i, 1]):
                if (freeTimes.iloc[i, 0]) < endBreak < (freeTimes.iloc[i, 1]):
                    breakTimes.append(possible_break)

    return breakTimes


# A welcome message to test our server
@app.route("/")
def index():

    time = dt.datetime.now()

    start1 = time.replace(hour=9, minute=0, second=0).timestamp()
    end1 = time.replace(hour=10, minute=0, second=0).timestamp()
    start2 = time.replace(hour=11, minute=30, second=0).timestamp()
    end2 = time.replace(hour=12, minute=0, second=0).timestamp()
    start3 = time.replace(hour=14, minute=0, second=0).timestamp()
    end3 = time.replace(hour=14, minute=15, second=0).timestamp()
    start4 = time.replace(hour=14, minute=30, second=0).timestamp()
    end4 = time.replace(hour=16, minute=0, second=0).timestamp()

    BOD = time.replace(hour=8, minute=0, second=0).timestamp()
    EOD = time.replace(hour=17, minute=0, second=0).timestamp()

    busyTimes = pd.DataFrame(
        {"start": [start1, start2, start3, start4],
            "end": [end1, end2, end3, end4]}
    )

    user_freeTimes = getFreeTimes(busyTimes, BOD, EOD)
    user_breakTimes = find_breakTimes(
        user_freeTimes,
        break_length=10,
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
