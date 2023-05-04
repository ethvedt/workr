#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import User, Project, ProjectMember, Team, TeamMember, Todo, Message

# Views go here!

class Login(Resource):
    def post(self):
        req = request.get_json()
        try:
            user = User.query.filter(User.username==req['username']).first()
            session['user_id'] = user.id
            if user.auth(req['password']) == False:
                return make_response({'error': 'Authentication failed'}, 401)
            return make_response(user.to_dict(only=('username', 'id')), 200)
        except:
            return make_response({'error': 'User not found.'}, 404)
    
api.add_resource(Login, '/login')
    
class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id==session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(only=('username', 'id')), 200)
        else:
            return make_response({'error': 'Unauthorized'}, 401)
    
api.add_resource(CheckSession, '/check_session')
        
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response('', 204)
    
api.add_resource(Logout, '/logout')

class Users(Resource):
    def get(self):
        u_list = User.query.all()

        return make_response(list(map(lambda c: c.to_dict(only=('id', 'username')), u_list)), 200)
    
    def post(self):
        req = request.get_json()

        try:
            u = User(username=req['username'], password=req['password'])
            db.session.add(u)
            db.session.commit()
            return make_response(u.to_dict(only=('username', 'id')), 200)
        except IntegrityError:
            return make_response({'error': 'error 400: Username already taken!'}, 400)
        except TypeError:
            return make_response({'error': 'error 400: Invalid username type!'}, 400)
        except ValueError:
            return make_response({'error': 'error 400: Invalid username!'}, 400)
        
api.add_resource(Users, '/users')

class UsersById(Resource):
    def get(self, id):
        u = User.query.filter(User.id==id).first()
        return u.to_dict(), 200
    
    def patch(self, id):
        req=request.get_json()
        u = User.query.filter(User.id==id).first()
        for (key, value) in req:
            if u[key] is not None:
                u[key] = value
        db.session
        return u.to_dict(), 200
    
    def delete(self, id):
        u = User.query.filter(User.id==id).first()
        if not u:
            return make_response('error: 404 User not found', 404)
        if u.id == session.user_id:
            session.user_id = None
        db.session.delete(u)
        db.session.commit()
        return make_response('', 204)

api.add_resource(UsersById, '/users/<int:id>')
            
class ProjectsByUserId(Resource):
    def get(self, id):
        p_list = Project.query.filter(Project.users.any(id ==id)).all()
        return make_response(list(map(lambda c: c.to_dict(only=('id', 'title', 'team.name', 'team.id', 'users.username', 'todos')), p_list)), 200)
    
api.add_resource(ProjectsByUserId, '/users/<int:id>/projects')

class TeamsByUserId(Resource):
    def get(self, id):
        t_list = Team.query.filter(Team.users.any(id == id)).all()
        
        return make_response(list(map(lambda c: c.to_dict(only=('id', 'name', 'company', 'users.username', 'users.id')), t_list)), 200)
    
api.add_resource(TeamsByUserId, '/users/<int:id>/teams')

class ProjectsByTeamId(Resource):
    def get(self, id):
        p_list = Project.query.filter(Project.team_id==id).all()
        return make_response(list(map(lambda c: c.to_dict(only=('id', 'title', 'team', 'todos')), p_list)), 200)

api.add_resource(ProjectsByTeamId, '/teams/<int:id>/projects')

class ProjectById(Resource):
    def patch(self, id):
        req = request.get_json()
        p = Project.query.filter(Project.id==id).first()
        for key, value in req:
            if p[key] is not None:
                p[key] = value
        db.session.commit()
        return p.to_dict(), 200
    
    def delete(self, id):
        p = Project.query.filter(Project.id==id).first()
        db.session.delete(p)
        db.session.commit()
        return make_response('', 204)
    
api.add_resource(ProjectById, '/projects/<int:id>')

class Projects(Resource):
    def post(self):
        req = request.get_json()
        p = Project(user_id = session.user_id, title = req['title'], team_id = req['team_id'])
        db.session.add(p)
        db.session.flush()
        pm = ProjectMember(project_id = p.id, user_id = session.user_id, user_role = req['user_role'])
        db.session.add(pm)
        db.session.commit()

api.add_resource(Projects, '/projects')

class ProjectMembersByProjectId(Resource):
    def get(self, id):
        pm = ProjectMember.query.filter(ProjectMember.project_id==id).all()
        
        return make_response(list(map(lambda c: c.to_dict(), pm)), 200)
    
    def post(self):
        req=request.get_json()
        pm = ProjectMember(project_id=req['project_id'], user_id=req['user_id'], user_role=req['user_role'])
        db.session.add(pm)
        db.session.commit()
        return pm.to_dict(), 200
    
api.add_resource(ProjectMembersByProjectId, '/projects/<int:id>/members')

class Todo(Resource):
    def post(self):
        req = request.get_json()
        td = Todo(title=req['title'], body=req['body'], user_id=session['user_id'], project_id=req['project_id'])
        db.session.add(td)
        db.session.commit()
        return td.to_dict(), 200

api.add_resource(Todo, '/todos')

class TodosByProjectId(Resource):
    def get(self, id):
        td_list = Todo.query.filter(Todo.project_id == id).all()

        
        return make_response(list(map(lambda c: c.to_dict(), td_list)), 200)

api.add_resource(TodosByProjectId, '/projects/<int:id>/todos')

class TodoById(Resource):
    def patch(self, id):
        req = request.get_json()
        td = Todo.query.filter(Todo.id == id).first()
        for key, value in req:
            td[key] = value
        db.session.commit()
        return td.to_dict(), 200
    
    def delete(self, id):
        td = Todo.query.filter(Todo.id == id).first()
        db.session.delete(td)
        db.session.commit()
        return make_response('', 204)

api.add_resource(TodoById, '/todos/<int:id>')

class Teams(Resource):
    def post(self):
        req = request.get_json()
        t = Team(name=req['name'], company=req['company'], user_id=session['user_id'])
        db.session.add(t)
        db.session.flush()
        tm = TeamMember(team_id=t.id, user_id=session['user_id'], user_role='owner')
        db.session.add(tm)
        db.session.commit()
        return t.to_dict(), 200
    
    def get(self):
        t = Team.query.all()
        
        return list(map(lambda c: c.to_dict(), t)), 200

api.add_resource(Teams, '/teams')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
