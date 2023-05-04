#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import *

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

        User.query.delete()
        Project.query.delete()
        ProjectMember.query.delete()
        Team.query.delete()
        TeamMember.query.delete()
        Todo.query.delete()
        Message.query.delete()

        et = User(username='ethvedt', password='password')
        db.session.add(et)

        for u in range(20):
            try:
                user = User(username=fake.unique.first_name(), password='password')
                db.session.add(user)
            except:
                user = User(username=fake.unique.first_name()+'1234', password='password')
                db.session.add(user)

        db.session.commit()

        uList = User.query.all()

        for t in range(5):
            role_list = ['owner', 'manager', 'senior', 'junior']
            users = []
            for u in range(4):
                users.append(fake.random_elements(elements=uList, unique=True, length=1)[0])
            owner = rc(users)
            team = Team(name=fake.word(), company=fake.unique.company(), user_id=owner.id)
            db.session.add(team)
            db.session.flush()
            role_list = ['owner', 'manager', 'senior', 'junior']
            for u in users:
                tm = TeamMember(team_id=team.id, user_id=u.id, user_role=('owner' if u==owner else 'senior'))
                db.session.add(tm)
        db.session.commit()

        tList = Team.query.all()

        for p in range(20):
            pTeam = rc(tList)
            project = Project(title=fake.word(), user_id=pTeam.user_id, team_id=pTeam.id)
            db.session.add(project)
            db.session.flush()
            role_list = ['owner', 'senior', 'junior']
            for u in pTeam.users:
                pm = ProjectMember(project_id=project.id, user_id=u.id, user_role=rc(role_list))
                db.session.add(pm)

        db.session.commit()

        pList = Project.query.all()

        for team in tList:
            if not TeamMember.query.filter(TeamMember.team_id == team.id).filter(TeamMember.user_id == et.id).first():
                tm = TeamMember(user=et, team=team, user_role='manager')
                db.session.add(tm)
        db.session.commit()

        for project in pList:
            if not ProjectMember.query.filter(ProjectMember.project_id == project.id).filter(ProjectMember.user_id == et.id).first():
                pm = ProjectMember(user=et, project=project, user_role='senior')
                db.session.add(pm)
        db.session.commit()
