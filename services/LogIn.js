export const getLogIn = () => {
    const URL = 'https://jummum.co/app/dev_jor/JORLogIn.php';
    return fetch(URL)
            .then((res) => res.json());
}
