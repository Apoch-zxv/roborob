__author__ = 'USER'
from communication.msging import *
from base_request import *

class ServerExecutionSuccessResponse(ServerResponse):
    def __init__(self):
        super(ServerExecutionSuccessResponse, self).__init__("Successfully executed", ServerErrorCodes.SUCCESS)

@register_request
class ExecuteCodeRequest(object):
    def __init__(self, context):
        self._context = context

    def handle_request(self, code):
        self._context.logger.info("Handle execute code request with: %s", code)
        return ServerExecutionSuccessResponse()