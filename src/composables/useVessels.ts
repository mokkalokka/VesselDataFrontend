import { ref } from 'vue'
import { Vessel } from "@/Interfaces/vesselInterface"
import { useFetch } from "@/composables/useFetch";

const vessels = ref([] as Vessel[])
const { fetchData } = useFetch("http://localhost:3000/vessels");

/**
 * Gives access to vessel data and vessels
 * @return fetchVessels, vessels
 */
export function useVessels() {

    function fetchVessels() {
        return fetchData()
    }
    return { fetchVessels, vessels }
}

/**
 * Return vessel based on id
 * @param {string | string[]} id from props
 * @return vessel
 */
export function getVesselById(id: string | string[]) {

    const index = ref();

    if (typeof id == "object") {
        index.value = parseInt(id[0]) - 1
    } else {
        index.value = parseInt(id) - 1
    }

    return vessels.value[index.value]
}