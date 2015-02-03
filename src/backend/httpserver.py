from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
from utils.logger import RoboLogger
from sys import argv

class RoboRobHttpRequestHandler(BaseHTTPRequestHandler):
    def __init__(self):
        self._logger = RoboLogger.get_logger()

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
 
    def do_GET(self):
        self._set_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")
 
    def do_HEAD(self):
        self._set_headers()
        
    def do_POST(self):
        self._set_headers()
        self._logger.debug("Recieved %s", self.rfile.read())
        self.wfile.write("<html><body><h1>POST!</h1></body></html>")
    
    @staticmethod    
    def listen(server_address = "127.0.0.1", port=8080):
        httpd = HTTPServer((server_address, port), RoboRobHttpRequestHandler)
        httpd.serve_forever()
 
if __name__ == "__main__":
    if len(argv) == 2:
        RoboRobHttpRequestHandler.listen(port = int(argv[1]))
    else:
        RoboRobHttpRequestHandler.listen()
