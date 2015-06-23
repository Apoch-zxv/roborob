__author__ = 'USER'
import time
from utils import Operation

def init():
    print "init"

def forward(ts):
    print "forward %d" % ts
    time.sleep(ts)
    print "forward"


def backward(ts):
    print "backward %d" % ts
    time.sleep(ts)
    print "backward"


def turn_right(ts):
    print "turn_right %d" % ts
    time.sleep(ts)
    print "turn_right"


def turn_left(ts):
    print "turn_left %d" % ts
    time.sleep(ts)
    print "turn_left"

def first_run():
    print "First run"

def length_to_ts(length):
    return 0.1


def degree_to_ts(length):
    return 0.1


def interface_exposure():
    return {"init": Operation(init, None), "go_forward": Operation(forward, length_to_ts), "go_backward": Operation(backward, length_to_ts),
            "turn_left": Operation(turn_left, degree_to_ts), "turn_right": Operation(turn_right, degree_to_ts),
            "first_run": Operation(first_run, None)}