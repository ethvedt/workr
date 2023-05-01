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

    project_members = db.relationship('ProjectMember', backref='user')
    projects = association_proxy('project_members', 'project')
    messages = db.relationship('ProjectMessage', backref='user')
    todos = db.relationship('Todo', backref='user')

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
            raise ValueError('Username must be between 4 and 32 characters.')
        else:
            return username
        
class Project(DefaultBase):
    __tablename__ = 'projects'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=True)

    project_members = db.relationship('ProjectMember', backref='project')
    users = association_proxy('project_members', 'user')
    messages = db.relationship('ProjectMessage', backref='project')
    todos = db.relationship('Todo', backref='project')


class ProjectMember(DefaultBase):
    __tablename__ = 'projectmembers'

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_role = db.Column(db.String)

    @validates('user_role')
    def val_user_role(self, role):
        role_list = ['owner', 'senior', 'junior']
        if role not in role_list:
            raise ValueError(f'Invalid role: {role}')
        else:
            return role
        
class Team(DefaultBase):
    __tablename__ = 'teams'

    name = db.Column(db.String)
    company = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    projects = db.relationship('Project', backref='team')
    team_members = db.relationship('TeamMember', backref='team')
    users = association_proxy('team_members', 'user')

class TeamMember(DefaultBase):
    __tablename__ = 'teammembers'

    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_role = db.Column(db.String)
    
    @validates('user_role')
    def val_user_role(self, role):
        role_list = ['manager', 'senior', 'junior']
        if role not in role_list:
            raise ValueError(f'Invalid role: {role}')
        else:
            return role

class Todo(DefaultBase):
    __tablename__ = 'todos'

    title = db.Column(db.String)
    body = db.Column(db.String)
    status = db.Column(db.String, server_default='not started')
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    serialize_rules=('-created_at', '-updated_at', '-project', '-user')

    @validates('status')
    def validate_status(self, status):
        stat_list = ['not started', 'in progress', 'testing', 'complete']
        if status not in stat_list:
            raise ValueError(f'Invalid status: {status}')
        return status
    
class Message(DefaultBase):
    __tablename__ = 'messages'

    body = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
