__author__ = 'USER'
from communication.msging import *
from base_request import *


class ServerExecutionSuccessResponse(ServerResponse):
    def __init__(self):
        super(ServerExecutionSuccessResponse, self).__init__("Successfully executed", ServerErrorCodes.SUCCESS)


@register_request
class DriverSingleMethodRequest(object):
    def __init__(self, context):
        self._context = context

    def handle_request(self, driver_inner_name, method_inner_name, params):
        method = self._context.driver_container.get_driver_method(driver_inner_name, method_inner_name)

        if method is None:
            return ServerAPIErrorResponse("Not such driver / method %s %s", driver_inner_name, method_inner_name)

        if not self._validate_params(method, params):
            return ServerAPIErrorResponse("The given params are not applible to the given "
                                          "method expected: %s given: %s" % (method.description, params))

        try:
            method(**self._get_callable_params(method.description.arguments, params))
            return ServerExecutionSuccessResponse()
        except Exception, e:
            err_msg = "Failed executing %s %s" % (driver_inner_name, method_inner_name)
            self._context.logger.error(err_msg)
            self._context.logger.exception(e)

            return ServerInternalErrorResponse(err_msg)