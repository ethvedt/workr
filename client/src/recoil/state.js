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
})

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

export const selectedProjectTodos = atom({
    key: 'selectedProjectTodos',
    default: []
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
