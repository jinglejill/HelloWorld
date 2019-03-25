export const getMaster = () => {
    // let username = name.toLowerCase().trim();
    const URL = 'https://jummum.co/app/dev_jor/JORMasterGet.php';
    return fetch(URL)
            .then((res) => res.json());
}
