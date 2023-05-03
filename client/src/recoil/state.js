import { atom, selector, selectorFamily } from 'recoil';

export const userAtom = atom({
    key: 'user',
    default: {
        id: null,
        username: null,
    },
});

export const userProjectsAtom = atom({
    key: 'userProjects',
    default: []
});

export const selectedProject = selectorFamily({
    key: 'selectedProject',
    get: (id) => ({get}) => {
        const pList = get(userProjectsAtom);
        for (const p in pList) {
            if (p['id'] === id) {
                return p;
            }
        }
        return null
    }
})

export const selectedProjectTodos = selectorFamily({
    key: 'selectedProjectTodos',
    get: (id) => async ({get}) => {
        const todos = await fetch(`/projects/${id}/todos`)
    }
})

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

export const userTeamsAtom = atom({
    key: 'userTeams',
    default: []
});

export const teamSelectList = selector({
    key: 'teamList',
    get: ({get}) => {
        const teams = get(userTeamsAtom);
        const teamList = [];
        for (const team in teams) {
            teamList.append({id: team.id, name: team.name, company: team.company});
        };
        return teamList;
    }
});

