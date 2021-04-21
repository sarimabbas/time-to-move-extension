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


def add_secs_to_time(time_val, secs_to_add):
    secs = (time_val.hour * 3600) + (time_val.minute * 60) + (time_val.second)
    secs += secs_to_add

    return dt.time(secs // 3600, (secs % 3600) // 60, secs % 60)


def find_breakTimes(freeTimes, break_length, time_between_breaks, time_after_busy, user_BOD):

    breakTimes = pd.DataFrame()

    # first break of the day:
    startBreak = add_secs_to_time(user_BOD, 45*60)
    endBreak = add_secs_to_time(startBreak, break_length*60)
    one_break = pd.DataFrame({'start': [startBreak], 'end': [endBreak]})

    breakTimes = breakTimes.append(one_break)

    for i in np.arange(0, len(freeTimes)):
        # break starts user input amount of mins after beginning of free time (= end of busy time)
        startBreak = add_secs_to_time(
            (freeTimes.iloc[i, 0]), time_after_busy*60)

        # currently a 10 minute break -- should be adjustable for user input
        endBreak = add_secs_to_time(startBreak, break_length*60)

        possible_break = pd.DataFrame(
            {'start': [startBreak], 'end': [endBreak]})

        possible_break_unix = pd.DataFrame(
            {'start': [startBreak.hour], 'end': [endBreak.hour]})

        # schedule the break if the start and the end of the break are during free time
        # possible break start must be after already scheduled break end

        if possible_break.iloc[0, 0] > breakTimes.iloc[0, 1]:  # for the first case
            if (freeTimes.iloc[i, 0]) < startBreak < (freeTimes.iloc[i, 1]):
                if (freeTimes.iloc[i, 0]) < endBreak < (freeTimes.iloc[i, 1]):
                    breakTimes = breakTimes.append(possible_break_unix)

        # while the end of the break is less than the end of the free time, schedule more breaks
        while (possible_break.iloc[0, 1] < freeTimes.iloc[i, 1]):
            startBreak = add_secs_to_time(
                (possible_break.iloc[0, 1]), time_between_breaks*60)

            # currently a 10 minute break -- should be adjustable for user input
            endBreak = add_secs_to_time(startBreak, break_length*60)

            possible_break = pd.DataFrame(
                {'start': [startBreak], 'end': [endBreak]})

            possible_break_unix = pd.DataFrame(
                {'start': [startBreak.hour], 'end': [endBreak.hour]})

            # schedule break if start and end are in free period
            if (freeTimes.iloc[i, 0]) < startBreak < (freeTimes.iloc[i, 1]):
                if (freeTimes.iloc[i, 0]) < endBreak < (freeTimes.iloc[i, 1]):
                    breakTimes = breakTimes.append(possible_break_unix)

    return breakTimes


# A welcome message to test our server
@app.route("/")
def index():

    start1 = dt.time(9, 0, 0)
    end1 = dt.time(10, 0, 0)
    start2 = dt.time(11, 30, 0)
    end2 = dt.time(12, 0, 0)
    start3 = dt.time(14, 0, 0)
    end3 = dt.time(14, 15, 0)
    start4 = dt.time(14, 30, 0)
    end4 = dt.time(16, 0, 0)

    BOD = dt.time(8, 0, 0)
    EOD = dt.time(17, 0, 0)

    busyTimes = pd.DataFrame(
        {'start': [start1, start2, start3, start4], 'end': [end1, end2, end3, end4]})

    user_freeTimes = getFreeTimes(busyTimes, BOD, EOD)
    user_breakTimes = find_breakTimes(
        user_freeTimes, break_length=10, time_between_breaks=45, time_after_busy=15, user_BOD=BOD)

    breakTimes_dict = user_breakTimes.to_dict('list')

    print(user_breakTimes)

    return jsonify(breakTimes_dict)


if __name__ == "__main__":
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
