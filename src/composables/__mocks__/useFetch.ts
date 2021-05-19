

export function useFetch(url: string, options: {} = {}) {
    const fetchData = async () => {
        try {
            return Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        } catch (errors) {
            console.log(errors);

        }
    };
    return { fetchData };
}

