__author__ = 'USER'

class Dictable(object):
    def __init__(self):
        self._description = None
        self._inner_name = None
        self._child = []

    def to_dict(self):
        res = {}
        res.update(self._description)
        res.update({"inner_name" : self._inner_name})

        children = []
        for c in self._child:
            children.append(c.to_dict())
        return res


class OperationDescription(Dictable):
    def __init__(self, inner_name, method, description):
        super(OperationDescription, self).__init__()
        self._inner_name = inner_name
        self._method = method
        self._description = description


class DriverDescription(Dictable):
    def __init__(self, inner_name, driver, description, operations):
        super(DriverDescription, self).__init__()
        self._inner_name = inner_name
        self._driver = driver
        self._description = description
        self._child = operations


class DriverContainer(object):
    def __init__(self, logger):
        self._drivers = {}
        self._logger = logger
        self._methods = {}

    def add_driver(self, driver):
        if driver in self._drivers:
            self._logger.error("Trying to add a driver that already exists !")
            return False

        try:
            inner_name = self.generate_driver_inner_name(driver)

            operation_descriptions = self._create_operation_descriptions(inner_name, driver.get_operations())
            self._methods.update(operation_descriptions)
            self._drivers[inner_name] = DriverDescription(inner_name, driver, driver.description,
                                                          operation_descriptions.values())
            return True
        except Exception, e:
            # TODO: Print stack trace
            self._logger.error("Failed retrieving driver operations: %s", e.message)
            return False

    def _create_operation_descriptions(self, driver_inner_name, operations):
        res = {}
        for method_name, method in operations:
            method_inner_name = "%s.%s" % (driver_inner_name, method_name)
            res.update({method_inner_name: OperationDescription(method_inner_name, method, method.description)})
        return res

    def generate_driver_inner_name(self, driver):
        return driver.__class__.__name__

    def get_driver_method(self, driver_name, method_name):
        if driver_name not in self._drivers:
            return None

        driver, operations = self._drivers[driver_name]

        if method_name not in operations:
            return None

        return operations[method_name]

    def get_all_drivers_names(self):
        return self._drivers.keys()

    def get_all_operations_dict(self):
        res = []
        for driver_description in self._drivers.values():
            res.append(driver_description.to_dict())
        return res
