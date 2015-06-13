from logger import RoboLogger
import json
from flask import Flask, send_from_directory, request

app = Flask(__name__)

WEB_PATH = "../../../frontend"

class RoboRobRequestHandler(object):
    INSTANCE = None

    def __init__(self):
        self._logger = RoboLogger.get_logger()

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
    app.run(debug=True)
