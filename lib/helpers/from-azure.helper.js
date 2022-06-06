import {getLocalStorage} from "./localstorage.helper";

export const fromAzure = () => {
    const activeUser = getLocalStorage('active-user');

    return !!activeUser && activeUser.fromAzure
}
