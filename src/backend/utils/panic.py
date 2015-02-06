import sys
import traceback


class Panic(object):
    def __init__(self, logger, msg, *params):
        error_msg = "PANIC: %s " % msg
        logger.fatal(error_msg, *params)
        for line in traceback.format_stack():
            logger.fatal(line.strip())
        sys.exit(1)

