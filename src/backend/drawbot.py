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

LEFT_LED = 16
RIGHT_LED = 18

ALL = [LEFT_FORWARD, RIGHT_FORWARD, LEFT_BACKWARD, RIGHT_BACKWARD, LEFT_LED, RIGHT_LED, PMW_A, PMW_B]

PWMS = []

def init():
    gpio.setmode(gpio.BOARD)
    for gp in ALL:
        gpio.setup(gp, gpio.OUT)

def before():
    freq = 50
    if len(PWMS) == 0:
        PWMS.append(gpio.PWM(PMW_A, freq))
        PWMS.append(gpio.PWM(PMW_B, freq))
    else:
        PWMS[0] = gpio.PWM(PMW_A, freq)
        PWMS[1] = gpio.PWM(PMW_B, freq)
    for p in PWMS:
        p.start(40)

def after():
    for p in PWMS:
        p.stop()

def forward(ts):
    before()
    gpio.output(LEFT_FORWARD, True)
    gpio.output(RIGHT_FORWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_FORWARD, False)
    gpio.output(RIGHT_FORWARD, False)
    after()


def backward(ts):
    before()
    gpio.output(LEFT_BACKWARD, True)
    gpio.output(RIGHT_BACKWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_BACKWARD, False)
    gpio.output(RIGHT_BACKWARD, False)
    after()


def turn_right(ts):
    before()
    gpio.output(LEFT_FORWARD, True)
    gpio.output(RIGHT_BACKWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_FORWARD, False)
    gpio.output(RIGHT_BACKWARD, False)
    after()

def turn_left(ts):
    before()
    gpio.output(LEFT_BACKWARD, True)
    gpio.output(RIGHT_FORWARD, True)
    time.sleep(ts)
    gpio.output(LEFT_BACKWARD, False)
    gpio.output(RIGHT_FORWARD, False)
    after()

def length_to_ts(length):
    return length * 0.05


def degree_to_ts(length):
    return length * (0.78 / 90.)


def interface_exposure():
    return {"init": Operation(init, None), "go_forward": Operation(forward, length_to_ts), "go_backward": Operation(backward, length_to_ts),
            "turn_left": Operation(turn_left, degree_to_ts), "turn_right": Operation(turn_right, degree_to_ts),
            "first_run": Operation(None, None)}