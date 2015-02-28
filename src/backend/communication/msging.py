import json
import collections

class RequestKlasses(object):
    REQUEST_KLASSES = {}
    @staticmethod
    def create_request(name, args):
        klass = collections.namedtuple(name, args)
        RequestKlasses.REQUEST_KLASSES[name] = klass
        return klass

    @staticmethod
    def get_klass_by_name(name):
        if name not in RequestKlasses.REQUEST_KLASSES:
            return None
        return RequestKlasses.REQUEST_KLASSES[name]


class ServerErrorCodes(object):
    SUCCESS = 0
    API_ERROR = 1
    NOT_SUPPORTED = 2
    INTERNAL_ERROR = 3


class ServerResponse(object):
    def __init__(self, message, status):
        self.status = status
        self.message = message

    def jsonable(self):
        return self.__dict__


class ServerAPIErrorResponse(ServerResponse):
    def __init__(self, message):
        super(ServerAPIErrorResponse, self).__init__(message, ServerErrorCodes.API_ERROR)


class ServerInternalErrorResponse(ServerResponse):
    def __init__(self, message):
        super(ServerInternalErrorResponse, self).__init__(message, ServerErrorCodes.INTERNAL_ERROR)


class ServerNotSupportedErrorResponse(ServerResponse):
    def __init__(self, message):
        super(ServerNotSupportedErrorResponse, self).__init__(message, ServerErrorCodes.NOT_SUPPORTED)

class ServerSuccessResponse(ServerResponse):
    def __init__(self, message = ""):
        super(ServerSuccessResponse, self).__init__(message, ServerErrorCodes.SUCCESS)


class ParseError(Exception):
    pass


class JsonParser(object):
    REQUEST_TYPE = "request_type"
    REQUEST_DATA = "request_data"

    SINGLE_REQUST_DRIVER_NAME = "single_request_driver_name"
    SINGLE_REQUST_METHOD_NAME = "single_request_method_name"
    SINGLE_REQUST_PARAMS = "single_request_params"

    @staticmethod
    def parse_response_to_json(response):
        return json.dumps(response.__dict__)

    @staticmethod
    def parse_json_request(raw_request):
        request = json.loads(raw_request)

        if type(request) != dict:
            raise ParseError("Request should be a dict not %s" % type(request))

        if JsonParser.REQUEST_TYPE not in request:
            raise ParseError("Expected request type %s" % JsonParser.REQUEST_TYPE)

        request_type = request[JsonParser.REQUEST_TYPE]

        if JsonParser.REQUEST_DATA not in request:
            raise ParseError("Expected request data %s" % JsonParser.REQUEST_DATA)

        return request_type, request[JsonParser.REQUEST_DATA]