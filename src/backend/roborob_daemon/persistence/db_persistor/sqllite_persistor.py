__author__ = 'USER'
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SqlPersistor(object):
    INSTANCE = None

    @staticmethod
    def get_instance():
        if SqlPersistor.INSTANCE is None:
            SqlPersistor.INSTANCE = SqlPersistor()
        return SqlPersistor.INSTANCE

    def __init__(self):
        self._engine = create_engine('sqlite:///temp.db', connect_args={'check_same_thread':False}, echo=True)
        self._session_maker = sessionmaker(bind=self._engine)
        self._session = self._session_maker()
        self._persistors_map = {}

    def get_session(self):
        return self._session

    def get_engine(self):
        return self._engine

    def create_all_if_needed(self):
        Base.metadata.create_all(bind = self._engine)

    def query_all(self, klass):
        return self._session.query(klass).all()

    def register_persistor(self, persistor_name, persistor):
        self._persistors_map[persistor_name] = persistor

    def __getattr__(self, name):
        if name in self._persistors_map:
            return self._persistors_map[name]
        else:
            raise AttributeError


def register_db_class(persistor_name):
    def inner_decorator(klass):
        SqlPersistor.get_instance().register_persistor(persistor_name, klass)
        return klass
    return inner_decorator
