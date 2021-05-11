import { toRefs, reactive } from 'vue';

export function useFetch(url: string, options: {} = {}) {
  const state = reactive({
    error: null,
    fetching: false
  });
  const fetchData = async () => {
    state.fetching = true;
    try {
      const res = await fetch(url, options);
      return await res.json();
    } catch (errors) {
      state.error = errors;
    } finally {
      state.fetching = false;
    }
  };
  return { ...toRefs(state), fetchData };
}

