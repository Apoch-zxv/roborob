from logger import RoboLogger
import json
import time
import threading
import platform
from flask import Flask, send_from_directory, request

if platform.node() != "DrawBot":
    print "Debug mode using dummy interface"
    from dummy_drawbot import interface_exposure
else:
    from drawbot import interface_exposure

app = Flask(__name__)

WEB_PATH = "../frontend"

class RoboRobRequestHandler(object):
    INSTANCE = None
    MAXIMAL_KEEP_ALIVE_INTERVAL = 10

    def __init__(self):
        self._logger = RoboLogger.get_logger()
        self._interface = interface_exposure()
        self._last_keep_alive = 0
        self._is_new_visit = True
        self.check_last_keep_alive()
        self._interface["init"].function()

    def check_last_keep_alive(self):
        threading.Timer(5.0, self.check_last_keep_alive).start()
        if (time.time() - self._last_keep_alive) > RoboRobRequestHandler.MAXIMAL_KEEP_ALIVE_INTERVAL:
            print "Visitor left"
            self._is_new_visit = True

    def handle_keep_alive(self, code_json):
        self._logger.debug("Received keep alive: %s", code_json)
        if self._is_new_visit:
            print "Visitor came"
            self._is_new_visit = False
            self._interface["first_run"].function()

        self._last_keep_alive = time.time()
        return {"status": "success"}

    def handle_code_execution(self, code_json):
        self._logger.debug("Received code: %s", code_json)
        self.inner_handle_code_execution(code_json)
        return {"status": "success"}

    def inner_handle_code_execution(self, code_json):
        for element in code_json:
            if element["name"] == "loop":
                for i in range(int(element["param"])):
                    self.inner_handle_code_execution(element["content"])
            else:
                interface_element = self._interface[element["name"]]
                interface_element.function(interface_element.param_converted_function(element["param"]))

    @staticmethod
    def get_instance():
        if RoboRobRequestHandler.INSTANCE is None:
            RoboRobRequestHandler.INSTANCE = RoboRobRequestHandler()
        return RoboRobRequestHandler.INSTANCE

@app.route('/api/keep_alive', methods=['GET', 'POST'])
def keep_alive():
    return json.dumps(RoboRobRequestHandler.get_instance().handle_keep_alive(json.loads(request.form["json"])))

@app.route('/api/execute_code', methods=['GET', 'POST'])
def execute_code():
    return json.dumps(RoboRobRequestHandler.get_instance().handle_code_execution(json.loads(request.form["json"])))

@app.route('/')
@app.route('/<path:path>', methods=['GET'])
def static_proxy(path="index.html"):
    return send_from_directory(WEB_PATH, path)


if __name__ == "__main__":
    if platform.node() != "DrawBot":
        print "Debug mode using dummy interface"
        app.run(debug = True)
    else:
        print "Running in production"
        app.run(host = "0.0.0.0", port = 80)
