__author__ = 'USER'
from sqlalchemy import Column, Integer, String
from sqllite_persistor import Base, SqlPersistor, register_db_class

@register_db_class("users")
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    fullname = Column(String)

    def __repr__(self):
       return "<User(name='%s', fullname='%s', password='%s')>" % (
                            self.name, self.fullname, self.password)

    @staticmethod
    def get_all():
        return SqlPersistor.get_instance().query_all(User)
