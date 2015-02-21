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
        elif isinstance(request, DriverGetAllOperationsRequestMessage):
            return self._handle_get_all_operations_request(request)
        elif isinstance(request, ExecuteCode):
            return self._handle_execute_code(request)

        return ServerNotSupportedErrorResponse("The request %s is not supported yet !" % type(request))

    def _handle_execute_code(self, request):
        self._logger.info("Handle execute code request with: %s", request)
        return ServerExecutionSuccessResponse()

    def _handle_get_all_operations_request(self, request):
        names = self._driver_container.get_all_operations()

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllOperationsSuccessResponse(names)

    def _handle_get_all_drivers_request(self, request):
        names = self._driver_container.get_all_drivers_names()

        if names is None:
            return ServerInternalErrorResponse("Drivers not initialized")

        return ServerAllDriversSuccessResponse(names)

    def _find_param_by_name(self, argument_list, param_name):
        for arg in argument_list:
            if arg.name == param_name:
                return arg
        return None

    def _validate_params(self, method, params):
        descriptor = method.description

        for param_name, param_value in params.iteritems():
            arg = self._find_param_by_name(descriptor.arguments, param_name)
            if arg is None:
                return False
        return True

    def _get_callable_params(self, argument_list, params):
        res = {}
        for param_key, param_value in params.iteritems():
            arg = self._find_param_by_name(argument_list, param_key)
            res[arg.real_name] = param_value
        return res

    def _handle_single_method_request(self, request):
        method = self._driver_container.get_driver_method(request.driver_name, request.method_name)

        if method is None:
            return ServerAPIErrorResponse("Not such driver / method %s %s", request.driver_name, request.method_name)

        if not self._validate_params(method, request.params):
            return ServerAPIErrorResponse("The given params are not applible to the given "
                                          "method expected: %s given: %s" % (method.description, request.params))

        try:
            method(**self._get_callable_params(method.description.arguments, request.params))
            return ServerExecutionSuccessResponse()
        except Exception, e:
            err_msg = "Failed executing %s %s" % (request.driver_name, request.method_name)
            self._logger.error(err_msg)
            self._logger.exception(e)

            return ServerInternalErrorResponse(err_msg)

