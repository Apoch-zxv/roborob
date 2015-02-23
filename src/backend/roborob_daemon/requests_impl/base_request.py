__author__ = 'USER'

REQUEST_CLASSES = []

def register_request(klass):
    REQUEST_CLASSES.append(klass)
    return klass

class BaseRequest(object):
    pass

