from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from utils.logger import RoboLogger
from interfaces.python_interface import *
from sys import argv
from communication.msging import *
import json
import os
from flask import Flask, send_from_directory, request

app = Flask(__name__)

WEB_PATH = "../../../frontend"

class RoboRobRequestHandler(object):
    INSTANCE = None

    def __init__(self):
        self._logger = RoboLogger.get_logger()
        self._interface = PythonInterface("localhost", 8888)

    def _general_to_rest(self, roborob_response):
        roborob_response.pop("status")
        roborob_response.pop("message")
        return roborob_response

    def _single_driver_operation_list_to_rest(self, driver_name, driver_operations):
        return {"name": driver_name, "operations": driver_operations}

    def handle_code_execution(self, parsed_path, request_content):
        self._logger.debug("Received path: %s request: %s", parsed_path, request_content)
        code = json.loads(request_content)["code"]
        self._logger.debug("The code: %s", code)
        self._interface.submit_code(code)

        return ServerSuccessResponse().jsonable()

    def handle_operations(self):
        operations = self._interface.get_all_operations()

        if int(operations["status"]) == ServerErrorCodes.SUCCESS:
            return self._general_to_rest(operations)
        else:
            return self._get_error_response(json.dumps(operations))

    def handle_debug_code(self, data):
        self._logger.info("Executing: " + data)
        res = "success"
        try:
            exec data
        except Exception, e:
            res = str(e)
        return {"status": res}

    def handle_users(self):
        users = self._interface.get_all_users()

        if int(users["status"]) == ServerErrorCodes.SUCCESS:
            general_rest = self._general_to_rest(users)
        else:
            return self._get_error_response(json.dumps(users))

    def _get_error_response(self, msg):
        self._logger.error(msg)
        return ServerAPIErrorResponse(msg).jsonable()

    @staticmethod
    def get_instance():
        if RoboRobRequestHandler.INSTANCE is None:
            RoboRobRequestHandler.INSTANCE = RoboRobRequestHandler()
        return RoboRobRequestHandler.INSTANCE

@app.route('/api/operations', methods=['GET', 'POST'])
def api_functions():
    return json.dumps(RoboRobRequestHandler.get_instance().handle_operations())

@app.route('/api/users', methods=['GET', 'POST'])
def api_users():
    return json.dumps(RoboRobRequestHandler.get_instance().handle_users())

@app.route('/api/debug', methods=['GET', 'POST'])
def api_debug():
    return json.dumps(RoboRobRequestHandler.get_instance().handle_debug_code(json.loads(request.data)["code"]))

@app.route('/')
@app.route('/<path:path>', methods=['GET'])
def static_proxy(path="index.html"):
    return send_from_directory(WEB_PATH, path)


if __name__ == "__main__":
    app.run(debug=True)
