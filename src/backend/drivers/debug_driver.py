import time
from base_driver import *

class DebugDriver(BaseDriver):
    def __init__(self, logger):
        self._logger = logger

    @driver_operation("Turn right", [DriverArgument("Time frame", int)])
    def turn_right(self, time_frame):
        self._logger.info("Debug driver: turning right")
        time.sleep(time_frame)