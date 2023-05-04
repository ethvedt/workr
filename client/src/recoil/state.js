import { atom, selector, selectorFamily } from 'recoil';

export const userAtom = atom({
    key: 'user',
    default: {
        id: null,
        username: null,
    },
});

export const userTeamsAtom = atom({
    key: 'userTeams',
    default: []
});

export const userProjectsAtom = atom({
    key: 'userProjects',
    default: []
});

export const userTodosAtom = atom({
    key: 'userTodos',
    default: []
});

export const selectedProject = selectorFamily({
    key: 'selectedProject',
    get: (id) => ({get}) => {
        const pList = get(userProjectsAtom);
        for (const p in pList) {
            if (p.id === id) {
                console.log(p)
                return p;
            }
        }
    }
});

export const selectedProjectTodos = selectorFamily({
    key: 'selectedProjectTodos',
    get: (id) => ({get}) => {
        const currentProject = get(selectedProject(id));
        const todos = get(userTodosAtom);
        const projectTodos = [];
        for (const t in todos) {
            if (t.project_id === currentProject.id) {
                projectTodos.push(t);
            }
        };
        return projectTodos;
    }
});

export const loggedIn = selector({
    key: 'loggedIn',
    get: ({get}) => {
        const user = get(userAtom);
        if (user.id) {
            return true;
        }
        else {
            return false;
        }
    }
});



export const teamSelectList = selector({
    key: 'teamList',
    get: ({get}) => {
        const teams = get(userTeamsAtom);
        const teamList = [];
        for (const team in teams) {
            teamList.push({id: team.id, name: team.name, company: team.company});
        };
        return teamList;
    }
});

export const teamOpts = selector({
    key: 'teamOpts',
    get: ({get}) => {
        const teams = get(teamSelectList);
        const optList = [];
        for (const team in teams) {
            optList.push({value: team, label: team.name})
        };
        return optList;
    }
});
