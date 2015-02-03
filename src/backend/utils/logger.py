import logging

class RoboLogger(object):
	LOGGER = None

	@staticmethod
	def get_logger():
		if RoboLogger.LOGGER is not None:
			return RoboLogger.LOGGER

		RoboLogger.LOGGER = logging.getLogger('RoboRob')
		hdlr = logging.FileHandler('/tmp/robolog.log')
		formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
		hdlr.setFormatter(formatter)

		console = logging.StreamHandler()
		console.setLevel(logging.INFO)

		RoboLogger.LOGGER.addHandler(console) 
		RoboLogger.LOGGER.addHandler(hdlr) 
		RoboLogger.LOGGER.setLevel(logging.DEBUG)
