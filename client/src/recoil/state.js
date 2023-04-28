import { atom, selector } from 'recoil';

export const userAtom = atom({
    key: 'user',
    default: {
        id: null,
        username: null,
    },
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
})