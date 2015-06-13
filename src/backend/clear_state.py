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

init()
