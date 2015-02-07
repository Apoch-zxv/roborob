import inspect
import collections

DriverArgument = collections.namedtuple("DriverArgument", "name type")
DriverOperation = collections.namedtuple("DriverMethod", "name arguments")


#def driver_operation(func, name, arguments):
def driver_operation(name, arguments):
    def inner_decorator(func):
        func.description = DriverOperation(name = name, arguments= arguments)
        return func
    return inner_decorator


class BaseDriver(object):
    def init(self):
        return True

    def get_operations(self):
        all_methods = inspect.getmembers(self, inspect.ismethod)

        operations = {}
        for method_name, method in all_methods:
            if hasattr(method, "description"):
                operations[method.description.name] = method

        return operations



