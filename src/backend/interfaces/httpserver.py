from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler
from utils.logger import RoboLogger
from python_interface import *
from sys import argv
import os

class RoboRobHttpRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **params):
        SimpleHTTPRequestHandler.__init__(self, *args, **params)
        self._logger = RoboLogger.get_logger()
        self._interface = PythonInterface("localhost", 8888)

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
    def do_POST(self):
        self._set_headers()
        self._logger.debug("Recieved %s", self.rfile.read())
        self.wfile.write("<html><body><h1>POST!</h1></body></html>")
    
    @staticmethod    
    def listen(server_address = "127.0.0.1", port=8080):
        os.chdir("../../frontend")
        httpd = HTTPServer((server_address, port), RoboRobHttpRequestHandler)
        httpd.serve_forever()
 
if __name__ == "__main__":
    if len(argv) == 2:
        RoboRobHttpRequestHandler.listen(port = int(argv[1]))
    else:
        RoboRobHttpRequestHandler.listen()
