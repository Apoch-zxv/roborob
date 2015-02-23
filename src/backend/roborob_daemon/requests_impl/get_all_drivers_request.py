__author__ = 'USER'
from communication.msging import *
from base_request import *

class ServerAllDriversSuccessResponse(ServerResponse):
    def __init__(self, driver_names):
        super(ServerAllDriversSuccessResponse, self).__init__("Successfully executed", ServerErrorCodes.SUCCESS)
        self.driver_names = driver_names

@register_request
class GetAllDriversRequest(object):
    def __init__(self, context):
        self._context = context

    def handle_request(self):
        names = self._context.driver_container.get_all_drivers_names()

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllDriversSuccessResponse(names)