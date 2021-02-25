
import { ref } from "vue";
import { useFetch } from "@/composables/useFetch"

interface Types {
    [key: string]: any | any[];
}

export function useSensorData() {
    /* const sensors = ref([] as Types) */
    const sensorNames = ref([] as Types)
    const data = ref([])
    /* const selectedSensors = ref([]) */
    const { response, error, fetching, fetchData } = useFetch('http://localhost:3000/sensors');


    function setSensorNames() {
        /* TODO: filter null values */
        const startTime = new Date(response.value[0]["time"][0])
        const endTime = new Date(response.value[0]["time"][3599])
        

        sensorNames.value = response.value.map((e: Types, index: number) => {
            const namefields = Object.keys(e)[0].split(".");
            return { id: index, 
                'filterkey': Object.keys(e)[0],
                'sensorName':  (namefields.length > 1 ? namefields[namefields.length - 2] + " " + namefields[namefields.length - 1] : namefields[0]),
                'description': namefields[0], startTime: startTime, endTime: endTime }
        })
        sensorNames.value = sensorNames.value.filter((sensor: any, index: number) => response.value[index][sensor.filterkey][0] != (null))
    }

    function getSensorDataById(sensorIds: number[]) {
        sensorIds.unshift(0) //Adds time   
        return sensorIds.map(id => Object.values(response.value[id])[0])
    }

    function initialize() {
        fetchData().then(() => {
            setSensorNames()

        })
    }

    return {
        getSensorDataById,
        sensorNames,
        error,
        fetching,
        fetchData,
        setSensorNames,
        initialize
    }
}

