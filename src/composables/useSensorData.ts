
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"

interface Types {
    [key: string]: any | any[];
}

export function useSensorData() {
    /* const sensors = ref([] as Types) */
    const sensorNames = ref([] as Types)
    /* const selectedSensors = ref([]) */
    const { response, error, fetching, fetchData } = useFetch('http://localhost:3000/sensors');


    function setSensorNames() {
        /* TODO: filter null values */
        sensorNames.value = response.value.map((e: Types, index: number) => {
            return { id: index, 'sensorName': Object.keys(e)[0] }
        })
    }

    function getSensorsById(sensorIds: number[]) {
        return sensorIds.map(id => response.value[id])

    }

    fetchData().then(() => {
        setSensorNames()
    })

    return {
        getSensorsById,
        sensorNames,
        error,
        fetching,
        fetchData
    }
}

