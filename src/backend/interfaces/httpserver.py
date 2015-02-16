from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from utils.logger import RoboLogger
from python_interface import *
from sys import argv
from communication.msging import *
import json
import os

class RoboRobHttpRequestHandler(SimpleHTTPRequestHandler):
    RESTFUL_API = "api"

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        if RoboRobHttpRequestHandler.RESTFUL_API in self.path:
            self.wfile.write(RoboRobRequestHandler.get_instance().handle_rest_request(self.path))
        else:
            SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        self._set_headers()
        content_length = int(self.headers['Content-Length'])
        request_text = self.rfile.read(content_length)
        self.wfile.write(RoboRobRequestHandler.get_instance().handle_single_request(request_text))

class RoboRobRequestHandler(object):
    INSTANCE = None

    def __init__(self):
        self._logger = RoboLogger.get_logger()
        self._interface = PythonInterface("localhost", 8888)
        self._interface.connect()
        self._rest_dict = {"operations" : self._handle_operations}

    def _general_to_rest(self, roborob_response):
        roborob_response.pop("status")
        roborob_response.pop("message")
        return roborob_response

    def _single_driver_operation_list_to_rest(self, driver_name, driver_operations):
        return {"name" : driver_name, "operations": driver_operations}

    def _handle_operations(self, parsed_path):
        operations = self._interface.get_all_operations()

        if int(operations["status"]) == ServerErrorCodes.SUCCESS:
            rest_res = []
            operations = self._general_to_rest(operations)
            for driver_name, driver_operations in operations["operations_dict"].iteritems():
                rest_res.append(self._single_driver_operation_list_to_rest(driver_name, driver_operations))
            return rest_res
        else:
            return self._get_error_response(json.dumps(operations))

    def _get_error_response(self, msg):
        self._logger.error(msg)
        return ServerAPIErrorResponse(msg)

    def _parse_path(self, path):
        return path.split("/")

    def handle_rest_request(self, rest_path):
        parsed_path = self._parse_path(rest_path)
        category = parsed_path[2]

        if category not in self._rest_dict:
            msg = "Recieved a request for an unknown category: %s" % category
            self._logger.error(msg)
            return json.dumps(ServerAPIErrorResponse(msg))

        return json.dumps(self._rest_dict[category](parsed_path))

    def handle_single_request(self, request):
        self._logger.debug("Recieved %s", request)
        return self._interface.send_message(request)

    @staticmethod
    def get_instance():
        if RoboRobRequestHandler.INSTANCE is None:
            RoboRobRequestHandler.INSTANCE = RoboRobRequestHandler()
        return RoboRobRequestHandler.INSTANCE

    @staticmethod
    def listen(server_address = "127.0.0.1", port=8080):
        os.chdir("../../frontend")
        httpd = HTTPServer((server_address, port), RoboRobHttpRequestHandler)
        print "Listening on http://%s:%d" % (server_address, port)
        httpd.serve_forever()

if __name__ == "__main__":
    if len(argv) == 2:
        RoboRobRequestHandler.listen(port = int(argv[1]))
    else:
        RoboRobRequestHandler.listen()
