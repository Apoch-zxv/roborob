__author__ = 'USER'
import RPi.GPIO as gpio
import  time
from utils import Operation

LEFT_FORWARD = 15
RIGHT_FORWARD = 7
LEFT_BACKWARD = 13
RIGHT_BACKWARD = 11

PMW_A = 40
PMW_B = 38

PMW_A_CONTROLLER = None
PMW_B_CONTROLLER = None

LEFT_LED = 16
RIGHT_LED = 18

ALL = [LEFT_FORWARD, RIGHT_FORWARD, LEFT_BACKWARD, RIGHT_BACKWARD, LEFT_LED, RIGHT_LED, PMW_A, PMW_B]

def init():
    gpio.setmode(gpio.BOARD)
    for gp in ALL:
        gpio.setup(gp, gpio.OUT)

def before():
    freq = 50
    global PMW_A_CONTROLLER
    global PMW_B_CONTROLLER
    PMW_A_CONTROLLER = gpio.PWM(PMW_A, freq)
    PMW_B_CONTROLLER = gpio.PWM(PMW_B, freq)

    PMW_A_CONTROLLER.start(40)
    PMW_B_CONTROLLER.start(40)

def after():
    PMW_A_CONTROLLER.stop()
    PMW_B_CONTROLLER.stop()

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
    return int(length) * 0.05

def degree_to_ts(length):
    return int(length) * (0.39 / 90.)


def interface_exposure():
    return {"init": Operation(init, None), "go_forward": Operation(forward, length_to_ts), "go_backward": Operation(backward, length_to_ts),
            "turn_left": Operation(turn_left, degree_to_ts), "turn_right": Operation(turn_right, degree_to_ts),
            "first_run": Operation(None, None), "before": Operation(before, None), "after": Operation(after, None)}