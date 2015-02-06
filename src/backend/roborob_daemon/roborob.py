import socket
import select
import collections
from thread import *

from utils.panic import Panic
from utils.logger import RoboLogger

class RoboRob(object):
    BACKLOG = 10
    RECV_BUFFER = 4096

    def __init__(self, working_dir):
        self._drivers = []
        self._working_dir = working_dir
        self._logger = RoboLogger.get_logger()
        self._conf = self._load_configuration(self._working_dir)
        self._active_sockets = []
        self._listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def _load_configuration(self, working_dir):
        return collections.namedtuple("RoboRobConfig", "host port")(host = "", port = "8888")

    def listen_for_requests(self):
        try:
            self._listen_socket.bind((self._conf.host, self._conf.port))
        except socket.error as msg:
            self._logger.error('Bind failed. Error Code : %s Message: %s', str(msg[0]), msg[1])
            Panic(self._logger, 'Bind failed. Error Code : %s Message: %s', str(msg[0]), msg[1])

        self._logger.info("Listenning on %s : %s", self._conf.host, self._conf.port)
        self._listen_socket.listen(RoboRob.BACKLOG)

        self._active_sockets.append(self._listen_socket)

        socket_addr_map = {self._listen_socket: ("Main socket", self._conf.port)}
        while True:
            read_sockets, write_sockets, error_sockets = select.select(self._active_sockets, [], [])

            for sock in read_sockets:
                if sock == self._listen_socket:
                    conn, addr = self._listen_socket.accept()
                    self._logger.info("Connected to %s : %s", addr[0], addr[1])
                    socket_addr_map[conn] = (addr[0], addr[1])
                    self._active_sockets.append(conn)
                else:
                    try:
                        addr, port = socket_addr_map[sock]
                        self._logger.info("Recieving data from %s : %s", addr, port)
                        data = sock.recv(RoboRob.RECV_BUFFER)
                        start_new_thread(self.single_request_handler, (sock, data, addr, port))
                    except:
                        addr, port = socket_addr_map[sock]
                        self._logger.info("Client (%s, %s) is offline", addr, port)
                        sock.close()
                        self._active_sockets.remove(sock)
                        socket_addr_map.pop(sock)
                        continue

        Panic(self._logger, 'Robo rob should never exit!')

    def single_request_handler(self, sock, data, addr, port):
        self._logger.info("Handling single request from %s : %s", addr, port)
        self._logger.debug("Recieved data: %s", data)