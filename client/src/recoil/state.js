import { atom, selector } from 'recoil';

export const userIdAtom = atom({
    key: 'userId',
    default: null,
});

export const loggedIn = selector({
    key: 'loggedIn',
    get: ({get}) => {
        const user = get(userIdAtom);
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
})