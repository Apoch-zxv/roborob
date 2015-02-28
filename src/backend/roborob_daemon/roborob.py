import socket
import select
from thread import *

from utils.panic import Panic
from utils.logger import RoboLogger

from drivers.base_driver import BASE_DRIVERS
from drivers.debug_driver import *

from driver_container import DriverContainer

from persistence.db_persistor.sqllite_persistor import *
from persistence.db_persistor.user import *

from request_handler import *


class RoboRob(object):
    BACKLOG = 10
    RECV_BUFFER = 4096

    def __init__(self, working_dir):
        self._drivers = []
        self._init_persistence_data()
        self._working_dir = working_dir
        self._logger = RoboLogger.get_logger()
        self._conf = self._load_configuration(self._working_dir)
        self._active_sockets = []
        self._listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._driver_container = DriverContainer(self._logger)
        self._request_handler = RequestHandler(self._logger, self._driver_container)

    def _init_persistence_data(self):
        self._db_persistor = SqlPersistor.get_instance()
        self._db_persistor.create_all_if_needed()

    def register_driver(self, driver_class):
        driver_instance = driver_class(self._logger)
        if driver_instance.init():
            self._driver_container.add_driver(driver_instance)
        else:
            self._logger.error("Failed initializing driver: %s", str(driver_class))

    def _load_configuration(self, working_dir):
        return collections.namedtuple("RoboRobConfig", "host port")(host = "", port = 8888)

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
        try:
            self._logger.info("Handling single request from %s : %s", addr, port)
            self._logger.debug("Recieved data: %s", data)
            request_type, request_data = JsonParser.parse_json_request(data)

            response = self._request_handler.handle_request(request_type, request_data)

        except ParseError, e:
            response = ServerAPIErrorResponse("Failed parsing request %s error: %s" % (data, repr(e)))
            self._logger.exception(e)
        except Exception, e:
            err_msg = "Failed executing request"
            self._logger.error(err_msg)
            self._logger.exception(e)
            response = ServerInternalErrorResponse(err_msg)
        except:
            err_msg = "Internal error while executing request"
            self._logger.error(err_msg)
            response = ServerInternalErrorResponse(err_msg)

        try:
            json_response = JsonParser.parse_response_to_json(response)
            self._logger.debug("Sending response: %s", json_response)
            sock.send(json_response)
        except Exception, e:
            self._logger.error("Failed sending response to %s : %s", addr, port)
            self._logger.exception(e)


    @staticmethod
    def start_eternal_server():
        try:
            roborob = RoboRob("C:\\roborob_output")
            for driver in BASE_DRIVERS:
                roborob.register_driver(driver)
            roborob.listen_for_requests()
        except Exception, e:
            RoboLogger.get_logger().error("Unhandle exception occured")
            RoboLogger.get_logger().exception(e)
            Panic(RoboLogger.get_logger(), "Unhandled exception")

if __name__ == "__main__":
    RoboRob.start_eternal_server()