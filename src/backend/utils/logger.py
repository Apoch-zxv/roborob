import os
import logging
import platform

class RoboLogger(object):
    LOGGER = None

    @staticmethod
    def get_logger():
        if RoboLogger.LOGGER is not None:
            return RoboLogger.LOGGER

        RoboLogger.LOGGER = logging.getLogger('RoboRob')
        hdlr = logging.FileHandler(os.path.join(RoboLogger._get_dir_for_logger(), 'robolog.log'))
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
        hdlr.setFormatter(formatter)

        console = logging.StreamHandler()
        console.setLevel(logging.INFO)

        RoboLogger.LOGGER.addHandler(console)
        RoboLogger.LOGGER.addHandler(hdlr)
        RoboLogger.LOGGER.setLevel(logging.DEBUG)

        return RoboLogger.LOGGER

    @staticmethod
    def _get_dir_for_logger():
        if "Windows" in platform.system():
            return "C:\\roborob_output"
        else:
            return "/tmp/"

