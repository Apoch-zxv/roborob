import inspect
BASE_DRIVERS = set()


def driver_operation(name, arguments):
    def inner_decorator(func):
        parsed_arguments = [(display_name, inner_name, arg_type.__name__) for (display_name, inner_name, arg_type) in arguments]
        func.description = {"name": name, "arguments": parsed_arguments}
        return func
    return inner_decorator


def driver(display_name):
    def inner_decorator(klass):
        BASE_DRIVERS.add(klass)
        klass.description = {"display_name": display_name}
        return klass
    return inner_decorator


class BaseDriver(object):
    def init(self):
        return True

    def get_operations(self):
        all_methods = inspect.getmembers(self, inspect.ismethod)

        return [(method_name, method) for method_name, method in all_methods if hasattr(method, "description")]



