export const getState = (key: string) => {
    const state = localStorage.getItem(key);
    if (state) {
        return JSON.parse(state);
    }
    return null;
}

export const setState = (key: string, state: any) => {
    localStorage.setItem(key, JSON.stringify(state));
}

export const removeState = (key: string) => {
    localStorage.removeItem(key);
}
