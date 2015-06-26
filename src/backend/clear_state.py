#!/usr/bin/python

import RPi.GPIO as gpio
import  time

def init():
    gpio.setmode(gpio.BOARD)
    gpio.setup(7, gpio.OUT)
    gpio.setup(11, gpio.OUT)
    gpio.setup(13, gpio.OUT)
    gpio.setup(15, gpio.OUT)
    gpio.setup(12, gpio.OUT)
    gpio.setup(16, gpio.OUT)
    gpio.output(7, False)
    gpio.output(11, False)
    gpio.output(13, False)
    gpio.output(15, False)
    gpio.output(12, False)
    gpio.output(16, False)

init()
