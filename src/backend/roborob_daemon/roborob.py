import socket
import select
import collections
from collections import defaultdict
from thread import *

from utils.panic import Panic
from utils.logger import RoboLogger

from drivers.debug_driver import DebugDriver

from communication.msging import *

from request_handler import *


class DisplayMethodArgInfo(object):
    def __init__(self, name, inner_name, type):
        self.name = name
        self.inner_name = inner_name
        self.type = type


class DisplayMethodInfo(object):
    def __init__(self, name, inner_name, args):
        self.name = name
        self.inner_name = inner_name
        self.args = args


class DriverContainer(object):
    def __init__(self, logger):
        self._drivers = {}
        self._logger = logger

    def add_driver(self, driver):
        if driver in self._drivers:
            self._logger.error("Trying to add a driver that already exists !")
            return False

        try:
            operations = driver.get_operations()

            self._drivers[driver.__class__.__name__] = (driver, operations)
            return True
        except Exception, e:
            # TODO: Print stack trace
            self._logger.error("Failed retrieving driver operations: %s", e.message)
            return False

    def get_driver_method(self, driver_name, method_name):
        if driver_name not in self._drivers:
            return None

        driver, operations = self._drivers[driver_name]

        if method_name not in operations:
            return None

        return operations[method_name]

    def get_all_drivers_names(self):
        return self._drivers.keys()

    def get_all_operations(self):
        res = defaultdict(list)
        for driver_name, (driver, operations) in self._drivers.iteritems():
            for op in operations.values():
                name = op.description.name
                inner_name = op.description.inner_name
                display_args = []
                for arg in op.description.arguments:
                    display_args.append(DisplayMethodArgInfo(name = arg.name, inner_name = arg.inner_name, type = arg.type.__name__).__dict__)
                res[driver_name].append(DisplayMethodInfo(name = name, inner_name= inner_name, args = display_args).__dict__)
        return res



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
        self._driver_container = DriverContainer(self._logger)
        self._request_handler = RequestHandler(self._logger, self._driver_container)

    def register_driver(self, driver_class):
        driver_instance = driver_class(self._logger)
        self._driver_container.add_driver(driver_instance)

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
            single_request = JsonParser.parse_json_request(data)

            response = self._request_handler.handle_request(single_request)

        except ParseError, e:
            response = ServerAPIErrorResponse("Failed parsing request %s error: %s" % (data, repr(e)))
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
            roborob.register_driver(DebugDriver)
            roborob.listen_for_requests()
        except Exception, e:
            RoboLogger.get_logger().error("Unhandle exception occured")
            RoboLogger.get_logger().exception(e)
            Panic(RoboLogger.get_logger(), "Unhandled exception")

if __name__ == "__main__":
    RoboRob.start_eternal_server()