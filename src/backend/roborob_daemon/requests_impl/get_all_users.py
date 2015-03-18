__author__ = 'USER'
from communication.msging import *
from base_request import *

class ServerAllUsersSuccessResponse(ServerResponse):
    def __init__(self, users_dict):
        super(ServerAllUsersSuccessResponse, self).__init__("Successfully executed", ServerErrorCodes.SUCCESS)
        self.users_dict = users_dict

@register_request
class GetAllUsersRequest(object):
    def __init__(self, context):
        self._context = context

    def handle_request(self):
        names = self._context.db_persistor.users.get_all()
        print names

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllUsersSuccessResponse(names)