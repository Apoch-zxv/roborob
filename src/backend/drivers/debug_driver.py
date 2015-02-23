import time
from base_driver import *

@driver("Debug driver")
class DebugDriver(BaseDriver):
    def __init__(self, logger):
        self._logger = logger

    @driver_operation("Turn right", [("Time frame", "time_frame", int)])
    def turn_right(self, time_frame):
        self._logger.info("Debug driver: turning right")
        time.sleep(time_frame)