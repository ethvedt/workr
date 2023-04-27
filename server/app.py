#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
from models import User

# Views go here!

class Login(Resource):
    def post(self):
        req = request.get_json()
        try:
            user = User.query.filter(User.username==req['username']).first()
        except:
            return make_response({'error': 'User not found.'}, 404)
        if user.auth(req.password) == False:
            return make_response({'error': 'Authentication failed'}, 401)
        session['user_id'] = user.id
        return make_response()
    
api.add_resource(Login, '/login')
    
class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.username==session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'Unauthorized'}, 401)
    
api.add_resource(CheckSession, '/check_session')
        
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response('', 204)
    
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
