__author__ = 'USER'
import RPi.GPIO as gpio
import  time
from utils import Operation

LEFT_FORWARD = 7
RIGHT_FORWARD = 13
LEFT_BACKWARD = 11
RIGHT_BACKWARD = 15

LEFT_LED = 16
RIGHT_LED = 18

ALL = [LEFT_FORWARD, RIGHT_FORWARD, LEFT_BACKWARD, RIGHT_BACKWARD, LEFT_LED, RIGHT_LED]


def init():
    gpio.setmode(gpio.BOARD)
    for gp in ALL:
        gpio.setup(gp, gpio.OUT)

def forward(ts):
    gpio.output(LEFT_FORWARD, True)
    gpio.output(RIGHT_FORWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_FORWARD, False)
    gpio.output(RIGHT_FORWARD, False)


def backward(ts):
    gpio.output(LEFT_BACKWARD, True)
    gpio.output(RIGHT_BACKWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_BACKWARD, False)
    gpio.output(RIGHT_BACKWARD, False)


def turn_right(ts):
    gpio.output(LEFT_FORWARD, True)
    gpio.output(RIGHT_BACKWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_FORWARD, False)
    gpio.output(RIGHT_BACKWARD, False)


def turn_left(ts):
    gpio.output(LEFT_BACKWARD, True)
    gpio.output(RIGHT_FORWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_BACKWARD, False)
    gpio.output(RIGHT_FORWARD, False)


def length_to_ts(length):
    pass


def degree_to_ts(length):
    pass


def interface_exposure():
    return {"init": Operation(init, None), "go_forward": Operation(forward, length_to_ts), "go_backward": Operation(backward, length_to_ts),
            "turn_left": Operation(turn_left, degree_to_ts), "turn_right": Operation(turn_right, degree_to_ts),
            "first_run": Operation(None, None)}