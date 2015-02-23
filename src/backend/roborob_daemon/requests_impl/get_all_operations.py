__author__ = 'USER'
from communication.msging import *
from base_request import *

class ServerAllOperationsSuccessResponse(ServerResponse):
    def __init__(self, operations_dict):
        super(ServerAllOperationsSuccessResponse, self).__init__("Successfully executed", ServerErrorCodes.SUCCESS)
        self.operations_dict = operations_dict

@register_request
class GetAllOperationsRequest(object):
    def __init__(self, context):
        self._context = context

    def handle_request(self):
        names = self._context.driver_container.get_all_operations_dict()

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllOperationsSuccessResponse(names)