from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class DefaultBase(db.Model, SerializerMixin):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    serialize_rules = ('-created_at', '-updated_at')

    def __repr__(self):
        return f'<Instance of {self.__class__.__name__}, ID {self.id}>'

class User(DefaultBase):
    __tablename__ = 'users'

    username = db.Column(db.String, unique=True)
    _password = db.Column(db.String)

    @hybrid_property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, p):
        p_hash = bcrypt.generate_password_hash(p).decode('utf-8')
        self._password = p_hash

    def auth(self, p):
        return bcrypt.check_password_hash(self.password, p)
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise TypeError('No username given.')
        elif type(username) is not str:
            raise TypeError('Username must be a string.')
        elif username.isalnum():
            raise ValueError('Username must be alphanumeric.')
        elif len(username) < 4 or len(username) > 32:
            return ValueError('Username must be between 4 and 32 characters.')
        else:
            return username