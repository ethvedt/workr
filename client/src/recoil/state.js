import { atom, selector } from 'recoil';

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
        const teamDict = [];
        for (const team in teams) {
            teamDict.append({id: team.id, name: team.name, company: team.company});
        };
        return teamDict;
    }
});