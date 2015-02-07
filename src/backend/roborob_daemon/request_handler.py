from communication.msging import *


class RequestHandler(object):
    def __init__(self, logger, driver_container):
        self._logger = logger
        self._driver_container = driver_container

    def handle_request(self, request):
        if isinstance(request, DriverSingleMethodRequestMessage):
            return self._handle_single_method_request(request)
        elif isinstance(request, DriverGetAllDriversRequestMessage):
            return self._handle_get_all_drivers_request(request)

        return ServerNotSupportedErrorResponse("The request %s is not supported yet !" % type(request))

    def _handle_get_all_drivers_request(self, request):
        names = self._driver_container.get_all_drivers_names()

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllDriversSuccessResponse(names)

    def _handle_single_method_request(self, request):
        method = self._driver_container.get_driver_method(request.driver_name, request.method_name)

        if method is None:
            return ServerAPIErrorResponse("Not such driver / method %s %s", request.driver_name, request.method_name)

        if not self._validate_params(method, request.params):
            return ServerAPIErrorResponse("The given params are not applible to the given "
                                          "method expected: %s given: %s" % (method.description, request.params))

        try:
            method(**request.params)
            return ServerExecutionSuccessResponse()
        except Exception, e:
            err_msg = "Failed executing %s %s" % (request.driver_name, request.method_name)
            self._logger.error(err_msg)
            self._logger.exception(e)

            return ServerInternalErrorResponse(err_msg)

