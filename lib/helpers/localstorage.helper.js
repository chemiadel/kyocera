// TODO @Ali Batuhan Bayraktar, this helper should be a hook.

export const getLocalStorage = (key) => JSON.parse(localStorage.getItem(`${key}`));

export const setLocalStorage = (key, value) => localStorage.setItem(`${key}`, JSON.stringify(value));

export const clearLocalStorage = () => localStorage.clear();

export const removeItemLocalStorage = (key) => {
    const keys = (Array.isArray(key) ? key : [key]);
    keys.forEach(key => localStorage.removeItem(`${key}`))
}
