from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from utils.logger import RoboLogger
from python_interface import *
from sys import argv
import os

class RoboRobHttpRequestHandler(SimpleHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
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
        httpd.serve_forever()

if __name__ == "__main__":
    if len(argv) == 2:
        RoboRobRequestHandler.listen(port = int(argv[1]))
    else:
        RoboRobRequestHandler.listen()
