
export function useFetch(url: string, options: {} = {}) {

    console.log('mock fetch :D');
    const fetchData = () => {

        return Promise.resolve({ 'test': [1, 2, 3, 4] })
    }
}

