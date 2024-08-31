const baseURL = 'http://localhost:3000';

export const getMatches = () => {
    return fetch(`${baseURL}/matches`)
        .then(res => res.json());
}

