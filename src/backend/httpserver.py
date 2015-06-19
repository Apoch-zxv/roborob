from logger import RoboLogger
import json
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

    def __init__(self):
        self._logger = RoboLogger.get_logger()
        self._interface = interface_exposure()

    def handle_code_execution(self, code_json):
        print code_json
        self._logger.debug("Received code: %s", code_json)
        return {"status": "success"}

    @staticmethod
    def get_instance():
        if RoboRobRequestHandler.INSTANCE is None:
            RoboRobRequestHandler.INSTANCE = RoboRobRequestHandler()
        return RoboRobRequestHandler.INSTANCE

@app.route('/api/execute_code', methods=['GET', 'POST'])
def execute_code():
    print "recieved data:", request.form["json"]
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
