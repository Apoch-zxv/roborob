from collections import namedtuple

from communication.msging import *
from requests_impl.base_request import *
from requests_impl.driver_single_method_request import *
from requests_impl.execute_code_operation import *
from requests_impl.get_all_drivers_request import *
from requests_impl.get_all_operations import *

Context = namedtuple("Context", "driver_container logger")

class RequestHandler(object):
    def __init__(self, logger, driver_container):
        self._logger = logger
        self._driver_container = driver_container
        self._request_context = Context(self._driver_container, self._logger)
        self._requests = {}
        self._register_requests()

    def _register_requests(self):
        for klass in REQUEST_CLASSES:
            self._requests[klass.__name__] = klass(self._request_context)

    def handle_request(self, request_type, request_data):
        if request_type not in self._requests:
            return ServerNotSupportedErrorResponse("The request %s is not supported yet !" % request_type)
        handler = self._requests[request_type]
        return handler.handle_request(**request_data)

