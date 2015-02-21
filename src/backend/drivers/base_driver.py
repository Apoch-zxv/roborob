import inspect
import collections

DriverArgument = collections.namedtuple("DriverArgument", "name inner_name type")
DriverOperation = collections.namedtuple("DriverMethod", "name inner_name arguments")

def generate_inner_name(func):
    func_name = func.func_name

    return func_name


def driver_operation(name, arguments):
    def inner_decorator(func):
        func.description = DriverOperation(name = name, inner_name= generate_inner_name(func), arguments= arguments)
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
                operations[method.description.inner_name] = method

        return operations



