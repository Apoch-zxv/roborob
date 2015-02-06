import socket

class PythonInterface(object):
    def __init__(self, addr, port):
        self._addr = addr
        self._port = port
        self._connect_socket = None

    def connect(self):
        self._connect_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        self._connect_socket.connect((self._addr, self._port))

    def send_message(self, msg):
        self._connect_socket.send(msg)
